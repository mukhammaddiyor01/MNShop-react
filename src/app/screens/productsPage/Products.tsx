import TuneIcon from "@mui/icons-material/Tune";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ProductCard } from "../../components/product/ProductCard";
import { useAppDispatch, useAppSelector } from "../../hooks";
import BuyerProductService from "../../services/BuyerProductService";
import { CatalogHero, CatalogHeroSlider } from "./CatalogHeroSlider";
import {
  retrieveCatalogProducts,
  retrieveCatalogProductsError,
  retrieveCatalogProductsLoading,
} from "./selector";
import {
  setCatalogProducts,
  setCatalogProductsError,
  setCatalogProductsLoading,
} from "./slice";

type CatalogCategory = "hoodies" | "tshirts" | "caps" | "cups" | "sale";

const catalogCategories: CatalogCategory[] = [
  "hoodies",
  "tshirts",
  "caps",
  "cups",
  "sale",
];

const productCategoryNames: Record<Exclude<CatalogCategory, "sale">, string> = {
  hoodies: "Hoodies",
  tshirts: "T-Shirts",
  caps: "Caps",
  cups: "Cups",
};

const catalogHeroes: Record<CatalogCategory, CatalogHero> = {
  hoodies: {
    images: [
      "/img/hoodieshero/hoodie-hero-02-lion.webp",
      "/img/hoodieshero/hoodie-hero-01-eagle.webp",
      "/img/hoodieshero/hoodie-hero-03-mounted-warrior.webp",
    ],
    eyebrow: "Heavyweight comfort",
    title: "Hoodies",
    description:
      "Oversized Korean silhouettes built for cold evenings, clean layers, and everyday comfort.",
  },
  tshirts: {
    images: [
      "/img/tshirtshero/tshirt-hero-01-dont-give-up.webp",
      "/img/tshirtshero/tshirt-hero-02-conversation.webp",
      "/img/tshirtshero/tshirt-hero-03-paisley-cascade.webp",
    ],
    eyebrow: "Seoul daily uniform",
    title: "T-Shirts",
    description:
      "Premium cotton tees with relaxed fits, strong graphics, and a street-ready finish.",
  },
  caps: {
    images: [
      "/img/capshero/cap-hero-01-athletic-motion.webp",
      "/img/capshero/cap-hero-02-wing-star.webp",
      "/img/capshero/cap-hero-03-geometric-b.webp",
    ],
    eyebrow: "Finish the fit",
    title: "Caps",
    description:
      "Minimal crowns, precise embroidery, and versatile shapes for every season.",
  },
  cups: {
    images: [
      "/img/cupshero/cup-hero-01-crescent-stars.webp",
      "/img/cupshero/cup-hero-02-bukhara-skyline.webp",
      "/img/cupshero/cup-hero-03-space-explorer.webp",
    ],
    eyebrow: "Coffee meets culture",
    title: "Cups",
    description:
      "Korean cafe mood for your desk, commute, and slower mornings at home.",
  },
  sale: {
    images: [
      "/img/sales page images/sales-hero.webp",
      "/img/sales page images/sales-hero2.webp",
      "/img/sales page images/sales-hero3.webp",
    ],
    eyebrow: "Limited prices",
    title: "Sale Collection",
    description:
      "Selected MNShop pieces at special prices while current stock lasts.",
    sale: true,
  },
};

const buyerProductService = new BuyerProductService();
const colorNames: Record<string, string> = {
  "#0a0a0a": "Black",
  "#111111": "Black",
  black: "Black",
  "#f8fafc": "White",
  "#ffffff": "White",
  white: "White",
  "#ef4444": "Red",
  red: "Red",
  "#3b82f6": "Blue",
  blue: "Blue",
};

const colorLabel = (color: string) => colorNames[color.toLowerCase()] || color;

function getActiveCategory(value: string | null): CatalogCategory {
  return catalogCategories.includes(value as CatalogCategory)
    ? (value as CatalogCategory)
    : "hoodies";
}

export function Products() {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const products = useAppSelector(retrieveCatalogProducts);
  const loadError = useAppSelector(retrieveCatalogProductsError);
  const isLoading = useAppSelector(retrieveCatalogProductsLoading);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const searchParams = new URLSearchParams(location.search);
  const activeCategory = getActiveCategory(searchParams.get("category"));
  const hero = catalogHeroes[activeCategory];
  const categoryProducts =
    activeCategory === "sale"
      ? products.filter((product) => product.sale)
      : products.filter(
          (product) =>
            product.category === productCategoryNames[activeCategory],
        );

  useEffect(() => {
    let active = true;

    dispatch(setCatalogProductsLoading(true));
    dispatch(setCatalogProductsError(""));

    buyerProductService
      .getProducts()
      .then((nextProducts) => {
        if (active) dispatch(setCatalogProducts(nextProducts));
      })
      .catch(() => {
        if (active) {
          dispatch(
            setCatalogProductsError(
              "Products could not be loaded. Please try again.",
            ),
          );
        }
      })
      .finally(() => {
        if (active) dispatch(setCatalogProductsLoading(false));
      });

    return () => {
      active = false;
    };
  }, [dispatch]);

  const availableColors = Array.from(
    new Set(categoryProducts.flatMap((product) => product.colors)),
  );
  const visibleProducts = selectedColors.length
    ? categoryProducts.filter((product) =>
        product.colors.some((color) => selectedColors.includes(color)),
      )
    : categoryProducts;

  const toggleColor = (color: string) => {
    setSelectedColors((current) =>
      current.includes(color)
        ? current.filter((item) => item !== color)
        : [...current, color],
    );
  };

  return (
    <main className="mnshop-products-catalog">
      <CatalogHeroSlider key={activeCategory} hero={hero} />

      <section className="mnshop-catalog">
        <div className="mnshop-catalog__heading">
          <div>
            <p>Current collection / {visibleProducts.length} pieces</p>
            <h2>Shop {hero.title}</h2>
          </div>

          <label className="mnshop-catalog__sort">
            <TuneIcon aria-hidden="true" />
            <span className="sr-only">Sort products</span>
            <select defaultValue="newest">
              <option value="newest">Newest</option>
              <option value="popular">Most popular</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
            </select>
          </label>
        </div>

        <div className="mnshop-catalog__layout">
          <aside className="mnshop-catalog__filters">
            <div className="mnshop-catalog__price-filter">
              <label htmlFor="catalog-price">Maximum price</label>
              <input
                id="catalog-price"
                type="range"
                min="100000"
                max="800000"
                defaultValue="800000"
              />
              <div>
                <span>100K KRW</span>
                <span>800K KRW</span>
              </div>
            </div>

            <div className="mnshop-catalog__color-filter">
              <p>Colors</p>
              {availableColors.map((color) => (
                <label key={color}>
                  <input
                    type="checkbox"
                    checked={selectedColors.includes(color)}
                    onChange={() => toggleColor(color)}
                  />
                  <span style={{ backgroundColor: color }} />
                  {colorLabel(color)}
                </label>
              ))}
              {!availableColors.length && (
                <small>No color variants available.</small>
              )}
            </div>

            {activeCategory !== "cups" && (
              <div className="mnshop-catalog__size-filter">
                <p>Sizes</p>
                <div>
                  {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                    <button key={size} type="button">
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </aside>

          <div className="mnshop-catalog__results">
            <div className="mnshop-catalog__results-heading">
              <p>{visibleProducts.length} products</p>
              <span>Seoul / Tashkent</span>
            </div>

            <div className="mnshop-catalog__grid">
              {isLoading && <p>Loading products…</p>}
              {!isLoading && loadError && <p role="alert">{loadError}</p>}
              {!isLoading &&
                !loadError &&
                visibleProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
