import AddIcon from "@mui/icons-material/Add";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import StarIcon from "@mui/icons-material/Star";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { Product } from "../../context/ContextProvider";
import { money, products } from "../../data/products";
import { useGlobals } from "../../hooks/useGlobals";

type ChosenProductParams = {
  productId: string;
};

const categoryQueries: Record<string, string> = {
  Hoodies: "hoodies",
  "T-Shirts": "tshirts",
  Caps: "caps",
  Cups: "cups",
};

const colorNames: Record<string, string> = {
  "#0a0a0a": "Black",
  "#111111": "Black",
  "#e5e7eb": "Cream",
  "#f8fafc": "Cream",
  "#3b82f6": "Blue",
};

const tabs = ["Description", "Reviews", "Shipping Info"];

function ProductDetail({ product }: { product: Product }) {
  const history = useHistory();
  const { authUser, likedIds, toggleLike, onAdd } = useGlobals();
  const images = Array.from(new Set([product.image, product.hoverImage]));
  const [image, setImage] = useState(images[0]);
  const [color, setColor] = useState(product.colors[0] || "Default");
  const [size, setSize] = useState(product.sizes[0] || "One Size");
  const [quantity, setQuantity] = useState(1);
  const [tab, setTab] = useState("Description");
  const liked = likedIds.includes(product.id);
  const categoryQuery = categoryQueries[product.category] || "hoodies";

  const guardBuyer = (callback: () => void) => {
    if (!authUser) {
      history.push(
        `/login?next=${encodeURIComponent(
          `${window.location.pathname}${window.location.search}`,
        )}`,
      );
      return;
    }

    if (authUser.role !== "BUYER") return;
    callback();
  };

  const addSelectedToCart = () => {
    guardBuyer(() => {
      for (let item = 0; item < quantity; item += 1) {
        onAdd(product, color, size);
      }
    });
  };

  return (
    <section className="mnshop-product-detail">
      <nav className="mnshop-product-detail__breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to={`/products?category=${categoryQuery}`}>
          {product.category}
        </Link>
        <span>/</span>
        <span>{product.name}</span>
      </nav>

      <div className="mnshop-product-detail__layout">
        <div className="mnshop-product-gallery">
          <div className="mnshop-product-gallery__thumbnails">
            {images.map((source, imageIndex) => (
              <button
                key={source}
                type="button"
                className={
                  source === image
                    ? "mnshop-product-gallery__thumbnail mnshop-product-gallery__thumbnail--active"
                    : "mnshop-product-gallery__thumbnail"
                }
                onClick={() => setImage(source)}
              >
                <img
                  src={source}
                  alt={`${product.name} view ${imageIndex + 1}`}
                />
              </button>
            ))}
          </div>

          <div className="mnshop-product-gallery__main">
            <img key={image} src={image} alt={product.name} />
          </div>
        </div>

        <div className="mnshop-product-info">
          <div className="mnshop-product-info__heading">
            <div>
              <p>MN / {product.category} / Korea</p>
              <h1>{product.name}</h1>
            </div>
            <button
              type="button"
              className={`mnshop-product-info__like${
                liked ? " mnshop-product-info__like--active" : ""
              }`}
              onClick={() => guardBuyer(() => toggleLike(product.id))}
              aria-label="Like product"
            >
              {liked ? (
                <FavoriteIcon aria-hidden="true" />
              ) : (
                <FavoriteBorderIcon aria-hidden="true" />
              )}
            </button>
          </div>

          <div className="mnshop-product-info__prices">
            <p>{money(product.price)}</p>
            {product.comparePrice && <p>{money(product.comparePrice)}</p>}
          </div>

          <div className="mnshop-product-info__metrics">
            <span>
              <StarIcon aria-hidden="true" />
              {product.rating.toFixed(1)}
            </span>
            <span>
              <VisibilityOutlinedIcon aria-hidden="true" />
              {product.views.toLocaleString()} views
            </span>
            <span>
              <FavoriteBorderIcon aria-hidden="true" />
              {(product.likes + (liked ? 1 : 0)).toLocaleString()} likes
            </span>
            <span>{product.sold} sold</span>
          </div>

          <p className="mnshop-product-info__description">
            {product.description}
          </p>

          <div className="mnshop-product-info__availability">
            <div>
              <p>Availability</p>
              <strong>{product.stock} pieces in stock</strong>
            </div>
            <div>
              <p>Seller</p>
              <strong>Seoul Studio / verified</strong>
            </div>
          </div>

          <div className="mnshop-product-options">
            <p>
              Color / {colorNames[color.toLowerCase()] || color}
            </p>
            <div className="mnshop-product-options__colors">
              {product.colors.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={
                    color === item
                      ? "mnshop-product-options__color mnshop-product-options__color--active"
                      : "mnshop-product-options__color"
                  }
                  onClick={() => setColor(item)}
                >
                  <span style={{ background: item }} />
                  {colorNames[item.toLowerCase()] || item}
                </button>
              ))}
            </div>
          </div>

          <div className="mnshop-product-options mnshop-product-options--sizes">
            <div className="mnshop-product-options__size-heading">
              <p>Size / {size}</p>
              <button type="button">Size guide</button>
            </div>
            <div className="mnshop-product-options__sizes">
              {product.sizes.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={
                    size === option
                      ? "mnshop-product-options__size mnshop-product-options__size--active"
                      : "mnshop-product-options__size"
                  }
                  onClick={() => setSize(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="mnshop-product-purchase">
            <div className="mnshop-product-purchase__quantity">
              <button
                type="button"
                onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                aria-label="Decrease quantity"
              >
                <RemoveIcon aria-hidden="true" />
              </button>
              <span>{quantity}</span>
              <button
                type="button"
                onClick={() =>
                  setQuantity((current) => Math.min(product.stock, current + 1))
                }
                aria-label="Increase quantity"
              >
                <AddIcon aria-hidden="true" />
              </button>
            </div>
            <button
              type="button"
              className="mnshop-product-purchase__add"
              onClick={addSelectedToCart}
            >
              <ShoppingBagOutlinedIcon aria-hidden="true" />
              Add to Cart
            </button>
          </div>

          <div className="mnshop-product-info__secondary-actions">
            <button type="button" onClick={addSelectedToCart}>
              Buy Now
            </button>
            <button
              type="button"
              onClick={() => guardBuyer(() => history.push("/chat"))}
            >
              <ChatBubbleOutlineIcon aria-hidden="true" />
              Message Seller
            </button>
          </div>
        </div>
      </div>

      <div className="mnshop-product-tabs">
        <div className="mnshop-product-tabs__list" role="tablist">
          {tabs.map((item) => (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={tab === item}
              className={
                tab === item
                  ? "mnshop-product-tabs__tab mnshop-product-tabs__tab--active"
                  : "mnshop-product-tabs__tab"
              }
              onClick={() => setTab(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="mnshop-product-tabs__content">
          {tab === "Description" && (
            <p>
              {product.description} Includes premium packaging, Korean sizing
              notes, and Uzbek customer support.
            </p>
          )}

          {tab === "Shipping Info" && (
            <p>
              Ships from South Korea. Uzbekistan delivery estimate is 5-10
              business days after seller processing.
            </p>
          )}

          {tab === "Reviews" && (
            <div className="mnshop-product-reviews">
              {["Azizbek", "Madina"].map((name, reviewIndex) => (
                <article key={name}>
                  <div>
                    <strong>{name}</strong>
                    <span>{reviewIndex + 2} days ago</span>
                  </div>
                  <p>
                    Fit is clean, fabric feels premium, and delivery updates
                    were clear.
                  </p>
                  <div className="mnshop-product-reviews__stars">
                    {Array.from({ length: 5 }, (_, star) => (
                      <StarIcon key={star} aria-hidden="true" />
                    ))}
                  </div>
                </article>
              ))}
              <button
                type="button"
                onClick={() => guardBuyer(() => undefined)}
              >
                Write a review
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export function ChosenProduct() {
  const { productId } = useParams<ChosenProductParams>();
  const product = products.find((item) => item.id === productId);

  if (!product) {
    return (
      <main className="mnshop-product-not-found">
        <h1>Product not found</h1>
        <Link to="/products">Back to products</Link>
      </main>
    );
  }

  return <ProductDetail key={product.id} product={product} />;
}
