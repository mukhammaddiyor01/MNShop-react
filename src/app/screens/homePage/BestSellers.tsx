import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { ProductCard } from "../../components/product/ProductCard";
import { products } from "../../data/products";

export function BestSellers() {
  const railRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: number) => {
    railRef.current?.scrollBy({
      left: direction * 360,
      behavior: "smooth",
    });
  };

  return (
    <section id="best-sellers" className="mnshop-best-sellers">
      <div className="mnshop-best-sellers__heading">
        <div>
          <p>01 / Community favourites</p>
          <h2>Best sellers, right now.</h2>
        </div>

        <div className="mnshop-best-sellers__heading-actions">
          <Link to="/products">
            View the collection
            <ArrowForwardIcon aria-hidden="true" />
          </Link>
          <button
            type="button"
            onClick={() => scroll(-1)}
            aria-label="Scroll products left"
          >
            <ArrowBackIosNewIcon aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            aria-label="Scroll products right"
          >
            <ArrowForwardIosIcon aria-hidden="true" />
          </button>
        </div>
      </div>

      <div ref={railRef} className="mnshop-best-sellers__rail no-scrollbar">
        {products.slice(0, 4).map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            badge="Best Seller"
          />
        ))}
      </div>
    </section>
  );
}
