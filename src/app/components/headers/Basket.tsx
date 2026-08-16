import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import RemoveIcon from "@mui/icons-material/Remove";
import { Link } from "react-router-dom";
import { money } from "../../data/products";
import { useGlobals } from "../../hooks/useGlobals";

const deliveryFee = 45_000;
const freeDeliveryFrom = 1_000_000;

export function CartDrawer() {
  const {
    basket,
    cartOpen,
    setCartOpen,
    onAdd,
    onRemove,
    onDelete,
  } = useGlobals();

  const subtotal = basket.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  const delivery =
    subtotal === 0 || subtotal >= freeDeliveryFrom ? 0 : deliveryFee;
  const total = subtotal + delivery;

  if (!cartOpen) return null;

  return (
    <>
      <button
        type="button"
        className="mnshop-cart-drawer__overlay"
        aria-label="Close cart"
        onClick={() => setCartOpen(false)}
      />

      <aside
        className="mnshop-cart-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mnshop-cart-drawer-title"
      >
        <div className="mnshop-cart-drawer__header">
          <h2 id="mnshop-cart-drawer-title">Cart</h2>
          <button
            type="button"
            className="mnshop-cart-drawer__close"
            aria-label="Close cart"
            onClick={() => setCartOpen(false)}
          >
            <CloseIcon />
          </button>
        </div>

        <div className="mnshop-cart-drawer__content">
          {basket.length === 0 ? (
            <p className="mnshop-cart-drawer__empty">Your cart is empty.</p>
          ) : (
            <div className="mnshop-cart-drawer__items">
              {basket.map((item) => {
                const itemKey = `${item.product.id}:${item.color}:${item.size}`;

                return (
                  <article key={itemKey} className="mnshop-cart-drawer__item">
                    <div className="mnshop-cart-drawer__image">
                      <img src={item.product.image} alt={item.product.name} />
                    </div>

                    <div className="mnshop-cart-drawer__item-content">
                      <p className="mnshop-cart-drawer__item-name">
                        {item.product.name}
                      </p>
                      <p className="mnshop-cart-drawer__variant">
                        {item.color} · {item.size}
                      </p>
                      <p className="mnshop-cart-drawer__item-price">
                        {money(item.product.price * item.quantity)}
                      </p>

                      <div className="mnshop-cart-drawer__item-actions">
                        <div className="mnshop-cart-drawer__quantity">
                          <button
                            type="button"
                            aria-label={`Decrease ${item.product.name} quantity`}
                            onClick={() => onRemove(itemKey)}
                          >
                            <RemoveIcon />
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            type="button"
                            aria-label={`Increase ${item.product.name} quantity`}
                            onClick={() =>
                              onAdd(item.product, item.color, item.size)
                            }
                          >
                            <AddIcon />
                          </button>
                        </div>

                        <button
                          type="button"
                          className="mnshop-cart-drawer__remove"
                          onClick={() => onDelete(itemKey)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        <div className="mnshop-cart-drawer__footer">
          <div className="mnshop-cart-drawer__summary">
            <div>
              <span>Subtotal</span>
              <span>{money(subtotal)}</span>
            </div>
            <div>
              <span>Shipping</span>
              <span>{delivery === 0 ? "Free" : money(delivery)}</span>
            </div>
            <div className="mnshop-cart-drawer__total">
              <span>Total</span>
              <span>{money(total)}</span>
            </div>
          </div>

          <Link
            to="/checkout"
            className="mnshop-cart-drawer__checkout"
            onClick={() => setCartOpen(false)}
          >
            Proceed to Checkout
          </Link>
          <button
            type="button"
            className="mnshop-cart-drawer__continue"
            onClick={() => setCartOpen(false)}
          >
            Continue Shopping
          </button>
        </div>
      </aside>
    </>
  );
}
