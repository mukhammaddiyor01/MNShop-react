import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import { useEffect } from "react";
import { Redirect } from "react-router-dom";
import { money } from "../../data/products";
import { useGlobals } from "../../hooks/useGlobals";
import { useAppDispatch, useAppSelector } from "../../hooks";
import BuyerHistoryService, {
  BuyerOrderHistory,
} from "../../services/BuyerHistoryService";
import {
  retrieveBuyerOrders,
  retrieveBuyerOrdersError,
  retrieveBuyerOrdersLoading,
} from "./selector";
import {
  setBuyerOrders,
  setBuyerOrdersError,
  setBuyerOrdersLoading,
} from "./slice";

type BuyerOrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

const orderSteps = [
  { status: "pending", label: "Order Placed", icon: AccessTimeIcon },
  { status: "processing", label: "Processing", icon: Inventory2OutlinedIcon },
  { status: "shipped", label: "Shipped", icon: LocalShippingOutlinedIcon },
  { status: "delivered", label: "Delivered", icon: CheckCircleOutlineIcon },
] as const;

const orderStatusRank = (status: BuyerOrderStatus) =>
  orderSteps.findIndex((step) => step.status === status);

const displayOrderId = (id: string) => {
  const normalized = id.replace(/^MN-/i, "");
  return `MN-${normalized.slice(-6).toUpperCase()}`;
};

const normalizeOrderStatus = (order: BuyerOrderHistory): BuyerOrderStatus => {
  const orderStatus = (order.orderStatus || "pending").toLowerCase();
  const status = (
    orderStatus === "cancelled"
      ? orderStatus
      : order.orderDeliveryStatus || orderStatus
  ).toLowerCase();

  if (
    status === "processing" ||
    status === "shipped" ||
    status === "delivered" ||
    status === "cancelled"
  ) {
    return status;
  }

  return "pending";
};

const orderItemSummary = (order: BuyerOrderHistory) => {
  const productsById = new Map(
    (order.productData || []).map((product) => [product._id, product]),
  );

  return (order.orderItems || [])
    .map((item) => {
      const product = productsById.get(String(item.productId));
      return `${product?.productName || "Product"} × ${item.itemQuantity}`;
    })
    .join(", ");
};

export function BuyerOrdersClient() {
  const { authUser, orderBuilder } = useGlobals();
  const dispatch = useAppDispatch();
  const orders = useAppSelector(retrieveBuyerOrders);
  const loading = useAppSelector(retrieveBuyerOrdersLoading);
  const error = useAppSelector(retrieveBuyerOrdersError);

  useEffect(() => {
    if (!authUser || authUser.role !== "BUYER") return;

    const buyerHistoryService = new BuyerHistoryService();
    let active = true;

    dispatch(setBuyerOrdersLoading(true));
    dispatch(setBuyerOrdersError(""));

    buyerHistoryService
      .getOrders()
      .then((result) => {
        if (active) dispatch(setBuyerOrders(result));
      })
      .catch((requestError: unknown) => {
        if (!active) return;
        dispatch(setBuyerOrders([]));
        dispatch(
          setBuyerOrdersError(
            requestError instanceof Error
              ? requestError.message
              : "Could not load orders",
          ),
        );
      })
      .finally(() => {
        if (active) dispatch(setBuyerOrdersLoading(false));
      });

    return () => {
      active = false;
    };
  }, [authUser, dispatch, orderBuilder]);

  if (!authUser) {
    return <Redirect to="/login?next=%2Forders" />;
  }

  if (authUser.role !== "BUYER") {
    return <Redirect to="/" />;
  }

  return (
    <section className="mnshop-buyer-orders">
      <h1>My Orders</h1>

      {loading && (
        <p className="mnshop-buyer-orders__loading">Loading orders…</p>
      )}

      {!loading && error && (
        <div className="mnshop-buyer-orders__empty" role="alert">
          {error}
        </div>
      )}

      {!loading && !error && orders.length === 0 && (
        <div className="mnshop-buyer-orders__empty">
          You have not placed an order yet.
        </div>
      )}

      <div className="mnshop-buyer-orders__list">
        {orders.map((order) => {
          const status = normalizeOrderStatus(order);
          const rank = orderStatusRank(status);

          return (
            <article key={order._id} className="mnshop-buyer-order">
              <div className="mnshop-buyer-order__heading">
                <div>
                  <p>{displayOrderId(order._id)}</p>
                  <p>
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString()
                      : "Today"}
                    <span> · </span>
                    {money(order.orderTotal)}
                  </p>
                  <p>{orderItemSummary(order)}</p>
                </div>

                <div className="mnshop-buyer-order__status-actions">
                  <span
                    className={`mnshop-buyer-order__status mnshop-buyer-order__status--${status}`}
                  >
                    {status}
                  </span>
                </div>
              </div>

              <div className="mnshop-buyer-order__timeline">
                {orderSteps.map((step, index) => {
                  const Icon = step.icon;
                  const active = status !== "cancelled" && index <= rank;

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

              {order.orderTrackingNumber && (
                <p className="mnshop-buyer-order__tracking">
                  Tracking: <strong>{order.orderTrackingNumber}</strong>
                </p>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
