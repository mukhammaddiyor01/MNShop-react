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
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1800&q=85",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1800&q=85",
      "https://images.unsplash.com/photo-1579572331145-5e53b299c64e?auto=format&fit=crop&w=1800&q=85",
    ],
    eyebrow: "Heavyweight comfort",
    title: "Hoodies",
    description:
      "Oversized Korean silhouettes built for cold evenings, clean layers, and everyday comfort.",
  },
  tshirts: {
    images: [
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1800&q=85",
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1800&q=85",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1800&q=85",
    ],
    eyebrow: "Seoul daily uniform",
    title: "T-Shirts",
    description:
      "Premium cotton tees with relaxed fits, strong graphics, and a street-ready finish.",
  },
  caps: {
    images: [
      "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=1800&q=85",
      "https://images.unsplash.com/photo-1534215754734-18e55d13e346?auto=format&fit=crop&w=1800&q=85",
      "https://images.unsplash.com/photo-1572307480813-ceb0e59d8325?auto=format&fit=crop&w=1800&q=85",
    ],
    eyebrow: "Finish the fit",
    title: "Caps",
    description:
      "Minimal crowns, precise embroidery, and versatile shapes for every season.",
  },
  cups: {
    images: [
      "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=1800&q=85",
      "https://images.unsplash.com/photo-1520034475321-cbe63696469a?auto=format&fit=crop&w=1800&q=85",
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1800&q=85",
    ],
    eyebrow: "Coffee meets culture",
    title: "Cups",
    description:
      "Korean cafe mood for your desk, commute, and slower mornings at home.",
  },
  sale: {
    images: [
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1800&q=85",
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1800&q=85",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1800&q=85",
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
            <p>
              Current collection / {visibleProducts.length} pieces
            </p>
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
              {!availableColors.length && <small>No color variants available.</small>}
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
              {!isLoading && !loadError && visibleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
