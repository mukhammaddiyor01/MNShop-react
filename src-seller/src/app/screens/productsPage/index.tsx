import { Container } from "@mui/material";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import SellerProductService, { SellerProduct } from "../../services/SellerProductService";
import {
  retrieveSellerProducts,
  retrieveSellerProductsError,
  retrieveSellerProductsLoading,
} from "./selector";
import {
  replaceSellerProduct,
  prependSellerProduct,
  setSellerProducts,
  setSellerProductsError,
  setSellerProductsLoading,
} from "./slice";

const sellerProductService = new SellerProductService();

const formatKrw = (value: number) =>
  `${new Intl.NumberFormat("en-US").format(value)} KRW`;

export function ProductsPage() {
  const dispatch = useAppDispatch();
  const products = useAppSelector(retrieveSellerProducts);
  const isLoading = useAppSelector(retrieveSellerProductsLoading);
  const loadError = useAppSelector(retrieveSellerProductsError);
  const [query, setQuery] = useState("");
  const [updatingProductId, setUpdatingProductId] = useState("");
  const [editorProduct, setEditorProduct] = useState<SellerProduct | null | undefined>(undefined);

  useEffect(() => {
    let isActive = true;

    dispatch(setSellerProductsLoading(true));
    dispatch(setSellerProductsError(""));

    sellerProductService
      .getMyProducts()
      .then((nextProducts) => {
        if (isActive) dispatch(setSellerProducts(nextProducts));
      })
      .catch(() => {
        if (isActive) {
          dispatch(
            setSellerProductsError(
              "Products could not be loaded. Please sign in again and try once more.",
            ),
          );
        }
      })
      .finally(() => {
        if (isActive) dispatch(setSellerProductsLoading(false));
      });

    return () => {
      isActive = false;
    };
  }, [dispatch]);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return products;
    return products.filter((product) =>
      [product.name, product.type, product.status]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [products, query]);

  const toggleProductStatus = async (productId: string, status: string) => {
    const nextStatus = status === "ACTIVE" ? "PAUSE" : "ACTIVE";
    setUpdatingProductId(productId);
    dispatch(setSellerProductsError(""));

    try {
      const updatedProduct = await sellerProductService.updateProduct(productId, {
        productStatus: nextStatus,
      });
      dispatch(replaceSellerProduct(updatedProduct));
    } catch {
      dispatch(setSellerProductsError("Product status could not be updated."));
    } finally {
      setUpdatingProductId("");
    }
  };

  return (
    <main className="mnshop-seller-products-page">
      <Container maxWidth="lg">
        <header className="mnshop-seller-products-page__heading">
          <div>
            <span>Catalog management</span>
            <h1>Products</h1>
            <p>{filteredProducts.length} visible products</p>
          </div>
          <label className="mnshop-seller-products-page__search">
            <span>Search products</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Name, category, or status"
            />
          </label>
          <button className="mnshop-seller-products-page__create" type="button" onClick={() => setEditorProduct(null)}>Add New Product</button>
        </header>

        <section className="mnshop-seller-products-page__table-wrap">
          {isLoading && <p role="status">Loading products…</p>}
          {!isLoading && loadError && <p role="alert">{loadError}</p>}
          {!isLoading && !loadError && products.length === 0 && (
            <p role="status">You have not created any products yet.</p>
          )}
          {!isLoading && !loadError && products.length > 0 && (
            <table>
              <thead>
                <tr>
                  <th scope="col">Product</th>
                  <th scope="col">Category</th>
                  <th scope="col">Price</th>
                  <th scope="col">Stock</th>
                  <th scope="col">Sold</th>
                  <th scope="col">Views</th>
                  <th scope="col">Likes</th>
                  <th scope="col">Status</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div className="mnshop-seller-products-page__product">
                        {product.images[0] && (
                          <img alt="" src={product.images[0]} />
                        )}
                        <strong>{product.name}</strong>
                      </div>
                    </td>
                    <td>{product.type}</td>
                    <td>{formatKrw(product.discountPrice || product.price)}</td>
                    <td>{product.stock}</td>
                    <td>{product.sold}</td>
                    <td>{product.views.toLocaleString()}</td>
                    <td>{product.likes.toLocaleString()}</td>
                    <td>
                      <span>{product.status}</span>
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => toggleProductStatus(product.id, product.status)}
                        disabled={updatingProductId === product.id}
                      >
                        {updatingProductId === product.id
                          ? "Saving…"
                          : product.status === "ACTIVE"
                            ? "Pause"
                            : "Publish"}
                      </button>
                      <button type="button" onClick={() => setEditorProduct(product)}>Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </Container>
      {editorProduct !== undefined && <ProductEditor product={editorProduct} onClose={() => setEditorProduct(undefined)} onSaved={(product, created) => {
        dispatch(created ? prependSellerProduct(product) : replaceSellerProduct(product));
        setEditorProduct(undefined);
      }} />}
    </main>
  );
}

function ProductEditor({ product, onClose, onSaved }: { product: SellerProduct | null; onClose: () => void; onSaved: (product: SellerProduct, created: boolean) => void }) {
  const [name, setName] = useState(product?.name || "");
  const [description, setDescription] = useState(product?.description || "");
  const [type, setType] = useState(product?.type || "TSHIRT");
  const [status, setStatus] = useState(product?.status || "PAUSE");
  const [price, setPrice] = useState(String(product?.price || ""));
  const [stock, setStock] = useState(String(product?.stock || ""));
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsedPrice = Number(price);
    const parsedStock = Number(stock);
    if (!name.trim() || !Number.isFinite(parsedPrice) || !Number.isInteger(parsedStock) || (!product && !image)) {
      setError("Name, price, stock, and an image are required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const saved = product
        ? await sellerProductService.updateProduct(product.id, { productName: name.trim(), productDesc: description.trim(), productType: type, productStatus: status, productPrice: parsedPrice, productLeftCount: parsedStock })
        : await sellerProductService.createProduct({ name: name.trim(), description: description.trim(), type, status, price: parsedPrice, stock: parsedStock, colors: ["BLACK"], sizes: ["M"], image: image! });
      onSaved(saved, !product);
    } catch {
      setError("The product could not be saved. Check the fields and try again.");
    } finally {
      setSaving(false);
    }
  };

  return <div className="mnshop-seller-product-editor" role="dialog" aria-modal="true" aria-label={product ? "Edit product" : "Add new product"}><form onSubmit={submit}><header><div><span>Catalog editor</span><h2>{product ? "Edit Product" : "Add New Product"}</h2></div><button type="button" onClick={onClose} aria-label="Close product editor">×</button></header><div className="mnshop-seller-product-editor__body"><label>Product name<input value={name} onChange={(event) => setName(event.target.value)} /></label><label>Description<textarea value={description} onChange={(event) => setDescription(event.target.value)} /></label><div><label>Category<select value={type} onChange={(event) => setType(event.target.value)}><option value="TSHIRT">T-shirt</option><option value="HOODIE">Hoodie</option><option value="CAPS">Cap</option><option value="MUGS">Cup</option></select></label><label>Status<select value={status} onChange={(event) => setStatus(event.target.value)}><option value="ACTIVE">Active</option><option value="PAUSE">Draft</option></select></label></div><div><label>Price (KRW)<input min="1" type="number" value={price} onChange={(event) => setPrice(event.target.value)} /></label><label>Stock<input min="0" type="number" value={stock} onChange={(event) => setStock(event.target.value)} /></label></div>{!product && <label>Product image<input accept="image/*" type="file" onChange={(event) => setImage(event.target.files?.[0] || null)} /></label>}{error && <p role="alert">{error}</p>}<button type="submit" disabled={saving}>{saving ? "Saving…" : "Save Product"}</button></div></form></div>;
}
