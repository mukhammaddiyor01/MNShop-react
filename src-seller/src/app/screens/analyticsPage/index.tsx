import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useEffect, useMemo, useState } from "react";
import SellerOrderService, { SellerOrder } from "../../services/SellerOrderService";
import SellerProductService, { SellerProduct } from "../../services/SellerProductService";
import "../../../css/analytics.css";

const productService = new SellerProductService();
const orderService = new SellerOrderService();
const formatKrw = (value: number) => `${new Intl.NumberFormat("en-US").format(value)} KRW`;

export function AnalyticsPage() {
  const [products, setProducts] = useState<SellerProduct[]>([]);
  const [orders, setOrders] = useState<SellerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    Promise.all([productService.getMyProducts(), orderService.getMyOrders()])
      .then(([nextProducts, nextOrders]) => { if (active) { setProducts(nextProducts); setOrders(nextOrders); } })
      .catch(() => { if (active) setError("Analytics could not be loaded. Please sign in again and try once more."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const analytics = useMemo(() => {
    const paidOrders = orders.filter((order) => order.paymentStatus === "PAID");
    const revenue = paidOrders.reduce((sum, order) => sum + order.total, 0);
    const views = products.reduce((sum, product) => sum + product.views, 0);
    const likes = products.reduce((sum, product) => sum + product.likes, 0);
    const maxProductValue = Math.max(1, ...products.map((product) => Math.max(product.sold, product.views, product.likes)));
    return { revenue, views, likes, paidOrders: paidOrders.length, maxProductValue, topProducts: [...products].sort((a, b) => (b.sold * 100 + b.views + b.likes) - (a.sold * 100 + a.views + a.likes)).slice(0, 5) };
  }, [orders, products]);

  return <main className="mnshop-seller-analytics"><header><span>Store performance</span><h2>Analytics</h2><p>Live product and order signals from your seller account.</p></header>{loading && <p className="mnshop-seller-analytics__notice" role="status">Loading analytics…</p>}{error && <p className="mnshop-seller-analytics__notice is-error" role="alert">{error}</p>}{!loading && !error && <><section className="mnshop-seller-analytics__metrics"><article><BarChartOutlinedIcon aria-hidden="true" /><p>Paid revenue</p><strong>{formatKrw(analytics.revenue)}</strong><small>{analytics.paidOrders} paid orders</small></article><article><VisibilityOutlinedIcon aria-hidden="true" /><p>Product views</p><strong>{analytics.views.toLocaleString()}</strong><small>Across {products.length} listings</small></article><article><FavoriteBorderRoundedIcon aria-hidden="true" /><p>Product likes</p><strong>{analytics.likes.toLocaleString()}</strong><small>Buyer interest signals</small></article></section><section className="mnshop-seller-analytics__content"><article><header><div><h3>Top listings</h3><p>Ranked by sales, views and likes.</p></div><span>{products.length} products</span></header>{analytics.topProducts.length ? <div className="mnshop-seller-analytics__list">{analytics.topProducts.map((product) => <div key={product.id}><div className="mnshop-seller-analytics__product"><img src={product.images[0]} alt="" /><span><strong>{product.name}</strong><small>{product.sold} sold · {formatKrw(product.price)}</small></span></div><div className="mnshop-seller-analytics__bar" aria-label={`${product.name} performance`}><i style={{ width: `${Math.max(8, ((product.sold || product.views || product.likes) / analytics.maxProductValue) * 100)}%` }} /></div><p><b>{product.sold}</b> sales <b>{product.views}</b> views <b>{product.likes}</b> likes</p></div>)}</div> : <p className="mnshop-seller-analytics__empty">Publish products to begin tracking listing performance.</p>}</article><article className="mnshop-seller-analytics__orders"><h3>Order pipeline</h3><p>Delivery status across your current orders.</p>{["PENDING", "PROCESSING", "SHIPPED", "DELIVERED"].map((status) => { const count = orders.filter((order) => order.deliveryStatus === status).length; return <div key={status}><span>{status[0]}{status.slice(1).toLowerCase()}</span><strong>{count}</strong></div>; })}</article></section></>}</main>;
}
