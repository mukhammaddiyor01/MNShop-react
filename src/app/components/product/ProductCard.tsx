import AddIcon from "@mui/icons-material/Add";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { Link, useHistory } from "react-router-dom";
import { Product } from "../../context/ContextProvider";
import { money } from "../../data/products";
import { useGlobals } from "../../hooks/useGlobals";

type ProductCardProps = {
  product: Product;
  badge?: string;
};

export function ProductCard({ product, badge }: ProductCardProps) {
  const history = useHistory();
  const { authUser, likedIds, getProductLikeCount, toggleLike, onAdd } = useGlobals();
  const liked = likedIds.includes(product.id);
  const likeCount = getProductLikeCount(product.id, product.likes);

  const requireBuyer = (action: () => void) => {
    if (!authUser) {
      history.push(
        `/login?next=${encodeURIComponent(
          `${window.location.pathname}${window.location.search}`,
        )}`,
      );
      return;
    }

    if (authUser.role !== "BUYER") return;
    action();
  };

  return (
    <article className="mnshop-product-card">
      <button
        type="button"
        className={`mnshop-product-card__like${
          liked ? " mnshop-product-card__like--active" : ""
        }`}
        aria-label="Like product"
        onClick={() => requireBuyer(() => toggleLike(product.id))}
      >
        {liked ? (
          <FavoriteIcon aria-hidden="true" />
        ) : (
          <FavoriteBorderIcon aria-hidden="true" />
        )}
      </button>

      {badge && <span className="mnshop-product-card__badge">{badge}</span>}
      {product.sale && !badge && (
        <span className="mnshop-product-card__badge mnshop-product-card__badge--sale">
          Sale
        </span>
      )}

      <Link
        to={`/products/${product.id}`}
        className="mnshop-product-card__media-link"
      >
        <div className="mnshop-product-card__media">
          <img
            src={product.image}
            alt={product.name}
            className="mnshop-product-card__image mnshop-product-card__image--primary"
            loading="lazy"
          />
          <img
            src={product.hoverImage || product.image}
            alt={`${product.name} alternate`}
            className="mnshop-product-card__image mnshop-product-card__image--alternate"
            loading="lazy"
          />
        </div>
      </Link>

      <div className="mnshop-product-card__content">
        <div className="mnshop-product-card__heading-row">
          <div>
            <p className="mnshop-product-card__eyebrow">
              {product.category} / Korea
            </p>
            <h3>{product.name}</h3>
            <div className="mnshop-product-card__prices">
              <span>{money(product.price)}</span>
              {product.comparePrice && (
                <span>{money(product.comparePrice)}</span>
              )}
            </div>
          </div>

          <button
            type="button"
            className="mnshop-product-card__add"
            aria-label="Add product to cart"
            title="Add to cart"
            onClick={() => requireBuyer(() => onAdd(product))}
          >
            <AddIcon aria-hidden="true" />
          </button>
        </div>

        <div className="mnshop-product-card__meta">
          <div className="mnshop-product-card__colors">
            {product.colors.slice(0, 4).map((color) => (
              <span
                key={color}
                title={color}
                style={{ background: color }}
              />
            ))}
          </div>

          <div className="mnshop-product-card__metrics">
            <span>
              <VisibilityOutlinedIcon aria-hidden="true" />
              {product.views.toLocaleString()}
            </span>
            <span>
              <FavoriteBorderIcon aria-hidden="true" />
              {likeCount.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
