import { Container } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import SellerProductService from "../../services/SellerProductService";
import {
  retrieveSellerProducts,
  retrieveSellerProductsError,
  retrieveSellerProductsLoading,
} from "./selector";
import {
  replaceSellerProduct,
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </Container>
    </main>
  );
}
