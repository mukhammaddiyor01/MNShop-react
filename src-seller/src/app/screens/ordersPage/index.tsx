import { Container } from "@mui/material";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import SellerOrderService, {
  DeliveryStatus,
  SellerOrder,
} from "../../services/SellerOrderService";
import {
  retrieveSellerOrders,
  retrieveSellerOrdersError,
  retrieveSellerOrdersLoading,
} from "./selector";
import {
  replaceSellerOrder,
  setSellerOrders,
  setSellerOrdersError,
  setSellerOrdersLoading,
} from "./slice";
import "../../../css/orders.scss";

const sellerOrderService = new SellerOrderService();
const formatKrw = (value: number) => `${new Intl.NumberFormat("en-US").format(value)} KRW`;

const nextDeliveryStatus = (status: string): { value: DeliveryStatus; label: string } | null => {
  switch (status) {
    case "PENDING": return { value: "PROCESSING", label: "Start processing" };
    case "PROCESSING": return { value: "SHIPPED", label: "Mark shipped" };
    case "SHIPPED": return { value: "DELIVERED", label: "Mark delivered" };
    case "FAILED": return { value: "PROCESSING", label: "Resume processing" };
    default: return null;
  }
};

export function OrdersPage() {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(retrieveSellerOrders);
  const isLoading = useAppSelector(retrieveSellerOrdersLoading);
  const loadError = useAppSelector(retrieveSellerOrdersError);
  const [trackingNumbers, setTrackingNumbers] = useState<Record<string, string>>({});
  const [updatingOrderId, setUpdatingOrderId] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    let isActive = true;
    dispatch(setSellerOrdersLoading(true));
    dispatch(setSellerOrdersError(""));
    sellerOrderService.getMyOrders()
      .then((nextOrders) => { if (isActive) dispatch(setSellerOrders(nextOrders)); })
      .catch(() => { if (isActive) dispatch(setSellerOrdersError("Orders could not be loaded. Please sign in again and try once more.")); })
      .finally(() => { if (isActive) dispatch(setSellerOrdersLoading(false)); });
    return () => { isActive = false; };
  }, [dispatch]);

  const filteredOrders = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return orders;
    return orders.filter((order) =>
      [order.id, order.buyerName, order.deliveryStatus, order.paymentStatus, ...order.items.map((item) => item.name)]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [orders, query]);

  const submitDeliveryUpdate = async (event: FormEvent<HTMLFormElement>, order: SellerOrder) => {
    event.preventDefault();
    const nextStatus = nextDeliveryStatus(order.deliveryStatus);
    if (!nextStatus) return;
    const trackingNumber = (trackingNumbers[order.id] || order.trackingNumber).trim();
    if (nextStatus.value === "SHIPPED" && !trackingNumber) {
      dispatch(setSellerOrdersError("A tracking number is required before shipping an order."));
      return;
    }
    setUpdatingOrderId(order.id);
    dispatch(setSellerOrdersError(""));
    try {
      const updatedOrder = await sellerOrderService.updateDeliveryStatus(order.id, nextStatus.value, trackingNumber || undefined);
      dispatch(replaceSellerOrder({
        ...updatedOrder,
        buyerName: updatedOrder.buyerName === "Buyer" ? order.buyerName : updatedOrder.buyerName,
      }));
    } catch {
      dispatch(setSellerOrdersError("The delivery status could not be updated. Please try again."));
    } finally {
      setUpdatingOrderId("");
    }
  };

  return <main className="mnshop-seller-orders-page"><Container maxWidth="lg"><header className="mnshop-seller-orders-page__heading"><div><span>Fulfillment desk</span><h1>Orders</h1><p>Manage paid orders, shipping progress, and tracking details.</p></div><label className="mnshop-seller-orders-page__search"><span>Search orders</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Order, buyer, product, or status" /></label><strong>{filteredOrders.length} orders</strong></header><section className="mnshop-seller-orders-page__table-wrap" aria-label="Seller orders">{isLoading && <p role="status">Loading orders…</p>}{!isLoading && loadError && <p role="alert">{loadError}</p>}{!isLoading && !loadError && orders.length === 0 && <p role="status">There are no orders for this seller yet.</p>}{!isLoading && !loadError && orders.length > 0 && <table><thead><tr><th scope="col">Order</th><th scope="col">Buyer</th><th scope="col">Product</th><th scope="col">Qty</th><th scope="col">Total</th><th scope="col">Date</th><th scope="col">Tracking</th><th scope="col">Status</th><th scope="col">Update</th></tr></thead><tbody>{filteredOrders.map((order) => { const nextStatus = order.paymentStatus === "PAID" ? nextDeliveryStatus(order.deliveryStatus) : null; const requiresTracking = nextStatus?.value === "SHIPPED"; return <tr key={order.id}><td><strong>#{order.id.slice(-8).toUpperCase()}</strong></td><td><strong>{order.buyerName}</strong></td><td><strong>{order.items.map((item) => item.name).join(", ")}</strong></td><td>{order.items.reduce((sum, item) => sum + item.quantity, 0)}</td><td>{formatKrw(order.total)}</td><td>{new Date(order.createdAt).toLocaleDateString()}</td><td>{order.trackingNumber || "Not shipped"}</td><td><b className={`mnshop-seller-orders-page__pill mnshop-seller-orders-page__pill--${order.deliveryStatus.toLowerCase()}`}>{order.paymentStatus === "PAID" ? order.deliveryStatus : "PAYMENT PENDING"}</b></td><td>{nextStatus ? <form onSubmit={(event) => submitDeliveryUpdate(event, order)}><input aria-label={`Tracking number for order ${order.id}`} placeholder={requiresTracking ? "Tracking number required" : "Tracking number"} value={trackingNumbers[order.id] ?? order.trackingNumber} onChange={(event) => setTrackingNumbers((current) => ({ ...current, [order.id]: event.target.value }))}/><button type="submit" disabled={updatingOrderId === order.id}>{updatingOrderId === order.id ? "Saving…" : nextStatus.label}</button></form> : <span>{order.paymentStatus === "PAID" ? "Completed" : "Awaiting payment"}</span>}</td></tr>; })}</tbody></table>}</section></Container></main>;
}
