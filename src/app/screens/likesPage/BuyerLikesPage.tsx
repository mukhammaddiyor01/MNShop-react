import { useEffect, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { ProductCard } from "../../components/product/ProductCard";
import { Product } from "../../context/ContextProvider";
import { useGlobals } from "../../hooks/useGlobals";
import BuyerProductService from "../../services/BuyerProductService";
import "../../../css/likes.css";

const buyerProductService = new BuyerProductService();

export function BuyerLikesPage() {
  const { authUser, likedIds } = useGlobals();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    if (!authUser) return;

    let active = true;
    buyerProductService
      .getProducts()
      .then((nextProducts) => {
        if (active) setProducts(nextProducts);
      })
      .catch(() => {
        if (active) setLoadError("Liked products could not be loaded.");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [authUser]);

  if (!authUser) return <Redirect to="/login?next=%2Flikes" />;
  if (authUser.role !== "BUYER") return <Redirect to="/" />;

  const likedProducts = products.filter((product) => likedIds.includes(product.id));

  return (
    <main className="mnshop-likes-page">
      <section className="mnshop-likes-page__content">
        <h1>Liked Items</h1>
        {isLoading && <p className="mnshop-likes-page__message">Loading liked items…</p>}
        {!isLoading && loadError && <p className="mnshop-likes-page__message" role="alert">{loadError}</p>}
        {!isLoading && !loadError && likedProducts.length > 0 && <div className="mnshop-likes-page__grid">{likedProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div>}
        {!isLoading && !loadError && likedProducts.length === 0 && <div className="mnshop-likes-page__empty"><p>No liked products yet.</p><Link to="/products">Explore products</Link></div>}
      </section>
    </main>
  );
}
