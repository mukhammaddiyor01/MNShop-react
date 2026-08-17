import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { CartItem } from "../../context/ContextProvider";
import { money } from "../../data/products";
import { useGlobals } from "../../hooks/useGlobals";

type BuyerOrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

type BuyerOrder = {
  id: string;
  date: string;
  total: number;
  status: BuyerOrderStatus;
  items: CartItem[];
  trackingNumber?: string;
};

const orderSteps = [
  { status: "pending", label: "Order Placed", icon: AccessTimeIcon },
  { status: "processing", label: "Processing", icon: Inventory2OutlinedIcon },
  { status: "shipped", label: "Shipped", icon: LocalShippingOutlinedIcon },
  { status: "delivered", label: "Delivered", icon: CheckCircleOutlineIcon },
] as const;

const orderStatusRank = (status: BuyerOrderStatus) =>
  orderSteps.findIndex((step) => step.status === status);

const readOrders = (): BuyerOrder[] => {
  try {
    const stored = JSON.parse(localStorage.getItem("mnshopOrders") || "[]");
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
};

const displayOrderId = (id: string) => {
  const normalized = id.replace(/^MN-/i, "");
  return `MN-${normalized.slice(-6).toUpperCase()}`;
};

export function BuyerOrdersClient() {
  const { authMember } = useGlobals();
  const [orders, setOrders] = useState<BuyerOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setOrders(readOrders());
    setLoading(false);
  }, []);

  const cancelOrder = (orderId: string) => {
    setOrders((current) => {
      const updated = current.map((order) =>
        order.id === orderId && order.status === "pending"
          ? { ...order, status: "cancelled" as const }
          : order,
      );
      localStorage.setItem("mnshopOrders", JSON.stringify(updated));
      return updated;
    });
  };

  if (!authMember) {
    return <Redirect to="/login?next=%2Forders" />;
  }

  if (authMember.role !== "BUYER") {
    return <Redirect to="/" />;
  }

  return (
    <section className="mnshop-buyer-orders">
      <h1>My Orders</h1>

      {loading && (
        <p className="mnshop-buyer-orders__loading">Loading orders…</p>
      )}

      {!loading && orders.length === 0 && (
        <div className="mnshop-buyer-orders__empty">
          You have not placed an order yet.
        </div>
      )}

      <div className="mnshop-buyer-orders__list">
        {orders.map((order) => {
          const rank = orderStatusRank(order.status);

          return (
            <article key={order.id} className="mnshop-buyer-order">
              <div className="mnshop-buyer-order__heading">
                <div>
                  <p>{displayOrderId(order.id)}</p>
                  <p>
                    {order.date
                      ? new Date(order.date).toLocaleDateString()
                      : "Today"}
                    <span> · </span>
                    {money(order.total)}
                  </p>
                  <p>
                    {order.items
                      .map(
                        (item) =>
                          `${item.product.name} × ${item.quantity}`,
                      )
                      .join(", ")}
                  </p>
                </div>

                <div className="mnshop-buyer-order__status-actions">
                  <span
                    className={`mnshop-buyer-order__status mnshop-buyer-order__status--${order.status}`}
                  >
                    {order.status}
                  </span>
                  {order.status === "pending" && (
                    <button
                      type="button"
                      onClick={() => cancelOrder(order.id)}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>

              <div className="mnshop-buyer-order__timeline">
                {orderSteps.map((step, index) => {
                  const Icon = step.icon;
                  const active = order.status !== "cancelled" && index <= rank;

                  return (
                    <div
                      key={step.status}
                      className={`mnshop-buyer-order__step${
                        active ? " mnshop-buyer-order__step--active" : ""
                      }`}
                    >
                      <Icon aria-hidden="true" />
                      <p>{step.label}</p>
                    </div>
                  );
                })}
              </div>

              {order.trackingNumber && (
                <p className="mnshop-buyer-order__tracking">
                  Tracking: <strong>{order.trackingNumber}</strong>
                </p>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
