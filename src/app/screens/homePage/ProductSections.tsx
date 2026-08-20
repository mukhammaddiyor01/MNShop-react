import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Link } from "react-router-dom";
import { ProductCard } from "../../components/product/ProductCard";
import { useAppSelector } from "../../hooks";
import { retrieveHomeProducts } from "./selector";

const categories = [
  { id: "tshirts", label: "T-Shirts", productCategory: "T-Shirts" },
  { id: "hoodies", label: "Hoodies", productCategory: "Hoodies" },
  { id: "caps", label: "Caps", productCategory: "Caps" },
  { id: "cups", label: "Cups", productCategory: "Cups" },
];

export function ProductSections() {
  const products = useAppSelector(retrieveHomeProducts);
  const saleProducts = products.filter((product) => product.sale).slice(0, 4);

  return (
    <>
      {categories.map((category, categoryIndex) => {
        const items = products
          .filter((product) => product.category === category.productCategory)
          .slice(0, 4);

        return (
          <section
            id={category.id}
            key={category.id}
            className={`mnshop-product-section${
              categoryIndex % 2 === 1
                ? " mnshop-product-section--alternate"
                : ""
            }`}
          >
            <div className="mnshop-product-section__inner">
              <div className="mnshop-product-section__heading">
                <div>
                  <p>
                    {String(categoryIndex + 2).padStart(2, "0")} / Category edit
                  </p>
                  <h2>{category.label}</h2>
                </div>
                <Link to={`/products?category=${category.id}`}>
                  See all
                  <ArrowForwardIcon aria-hidden="true" />
                </Link>
              </div>

              <div className="mnshop-product-section__grid">
                {items.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>
        );
      })}

      <section id="sale" className="mnshop-product-section mnshop-sale-section">
        <div className="mnshop-product-section__inner">
          <div className="mnshop-product-section__heading">
            <div>
              <p>06 / Last sizes</p>
              <h2>Sale, without the noise.</h2>
            </div>
            <Link to="/products?category=sale">
              Shop sale
              <ArrowForwardIcon aria-hidden="true" />
            </Link>
          </div>

          <div className="mnshop-product-section__grid">
            {saleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
