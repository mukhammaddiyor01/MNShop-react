import { Container } from "@mui/material";
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
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
const availableColors = ["BLACK", "WHITE", "RED", "BLUE"] as const;
const colorLabels: Record<(typeof availableColors)[number], string> = {
  BLACK: "Black",
  WHITE: "White",
  RED: "Red",
  BLUE: "Blue",
};

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
  const [colors, setColors] = useState<string[]>(product?.colors || ["BLACK"]);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const previewUrls = images.map((image) => URL.createObjectURL(image));
    setImagePreviews(previewUrls);
    return () => previewUrls.forEach((previewUrl) => URL.revokeObjectURL(previewUrl));
  }, [images]);

  const selectImages = (event: ChangeEvent<HTMLInputElement>) => {
    const nextImages = Array.from(event.target.files || []);
    if (nextImages.some((image) => !image.type.startsWith("image/"))) {
      setError("Only image files can be uploaded.");
      event.target.value = "";
      return;
    }
    if (images.length + nextImages.length > 10) {
      setError(`You can upload up to 10 product images. ${10 - images.length} slot(s) remaining.`);
      event.target.value = "";
      return;
    }
    setImages((current) => [...current, ...nextImages]);
    setError("");
    event.target.value = "";
  };

  const removeImage = (index: number) => {
    setImages((current) => current.filter((_, imageIndex) => imageIndex !== index));
  };

  const moveImage = (index: number, direction: -1 | 1) => {
    setImages((current) => {
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= current.length) return current;
      const nextImages = [...current];
      [nextImages[index], nextImages[targetIndex]] = [nextImages[targetIndex], nextImages[index]];
      return nextImages;
    });
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsedPrice = Number(price);
    const parsedStock = Number(stock);
    if (!name.trim() || !Number.isFinite(parsedPrice) || !Number.isInteger(parsedStock) || colors.length === 0 || (!product && images.length === 0)) {
      setError("Name, price, stock, at least one color, and one product image are required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const saved = product
        ? await sellerProductService.updateProduct(product.id, { productName: name.trim(), productDesc: description.trim(), productType: type, productStatus: status, productPrice: parsedPrice, productLeftCount: parsedStock, productColors: colors })
        : await sellerProductService.createProduct({ name: name.trim(), description: description.trim(), type, status, price: parsedPrice, stock: parsedStock, colors, sizes: ["M"], images });
      onSaved(saved, !product);
    } catch {
      setError("The product could not be saved. Check the fields and try again.");
    } finally {
      setSaving(false);
    }
  };

  const toggleColor = (color: string) => setColors((current) => current.includes(color) ? current.filter((item) => item !== color) : [...current, color]);

  return <div className="mnshop-seller-product-editor" role="dialog" aria-modal="true" aria-label={product ? "Edit product" : "Add new product"}><form onSubmit={submit}><header><div><span>Catalog editor</span><h2>{product ? "Edit Product" : "Add New Product"}</h2></div><button type="button" onClick={onClose} aria-label="Close product editor">×</button></header><div className="mnshop-seller-product-editor__body"><label>Product name<input value={name} onChange={(event) => setName(event.target.value)} /></label><label>Description<textarea value={description} onChange={(event) => setDescription(event.target.value)} /></label><div><label>Category<select value={type} onChange={(event) => setType(event.target.value)}><option value="TSHIRT">T-shirt</option><option value="HOODIE">Hoodie</option><option value="CAPS">Cap</option><option value="MUGS">Cup</option></select></label><label>Status<select value={status} onChange={(event) => setStatus(event.target.value)}><option value="ACTIVE">Active</option><option value="PAUSE">Draft</option></select></label></div><div><label>Price (KRW)<input min="1" type="number" value={price} onChange={(event) => setPrice(event.target.value)} /></label><label>Stock<input min="0" type="number" value={stock} onChange={(event) => setStock(event.target.value)} /></label></div><fieldset className="mnshop-seller-product-editor__color-options"><legend>Available colors</legend><div>{availableColors.map((color) => <label key={color}><input type="checkbox" checked={colors.includes(color)} onChange={() => toggleColor(color)} /><span className={`is-${color.toLowerCase()}`} aria-hidden="true" />{colorLabels[color]}</label>)}</div></fieldset>{!product && <><label className="mnshop-seller-product-editor__image-picker">Product images <small>{images.length}/10 selected</small><input accept="image/png,image/jpeg,image/webp" type="file" multiple onChange={selectImages} /></label>{imagePreviews.length > 0 && <div className="mnshop-seller-product-editor__image-previews" aria-label="Selected product image previews">{imagePreviews.map((preview, index) => <figure key={`${images[index].name}-${index}`}><img src={preview} alt={`Selected product ${index + 1}`} /><button className="mnshop-seller-product-editor__remove-image" type="button" onClick={() => removeImage(index)} aria-label={`Remove image ${index + 1}`}>×</button><div className="mnshop-seller-product-editor__image-order"><button type="button" onClick={() => moveImage(index, -1)} disabled={index === 0} aria-label={`Move image ${index + 1} earlier`}>←</button><button type="button" onClick={() => moveImage(index, 1)} disabled={index === images.length - 1} aria-label={`Move image ${index + 1} later`}>→</button></div></figure>)}</div>}</>}{error && <p role="alert">{error}</p>}<button type="submit" disabled={saving}>{saving ? "Saving…" : "Save Product"}</button></div></form></div>;
}
