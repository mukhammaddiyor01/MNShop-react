import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks";
import SellerOrderService from "../../services/SellerOrderService";
import SellerProductService from "../../services/SellerProductService";
import {
  retrieveSellerOverviewError,
  retrieveSellerOverviewLoading,
  retrieveSellerOverviewOrders,
  retrieveSellerOverviewProducts,
} from "./selector";
import {
  setSellerOverviewData,
  setSellerOverviewError,
  setSellerOverviewLoading,
} from "./slice";
import "../../../css/overview.css";

const sellerOrderService = new SellerOrderService();
const sellerProductService = new SellerProductService();
const formatKrw = (value: number) => `${new Intl.NumberFormat("en-US").format(value)} KRW`;

export function OverviewPage() {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const products = useAppSelector(retrieveSellerOverviewProducts);
  const orders = useAppSelector(retrieveSellerOverviewOrders);
  const isLoading = useAppSelector(retrieveSellerOverviewLoading);
  const loadError = useAppSelector(retrieveSellerOverviewError);

  useEffect(() => {
    let active = true;
    dispatch(setSellerOverviewLoading(true));
    dispatch(setSellerOverviewError(""));

    Promise.all([sellerProductService.getMyProducts(), sellerOrderService.getMyOrders()])
      .then(([nextProducts, nextOrders]) => {
        if (active) dispatch(setSellerOverviewData({ products: nextProducts, orders: nextOrders }));
      })
      .catch(() => {
        if (active) dispatch(setSellerOverviewError("Dashboard data could not be loaded. Please sign in again and try once more."));
      })
      .finally(() => {
        if (active) dispatch(setSellerOverviewLoading(false));
      });

    return () => { active = false; };
  }, [dispatch]);

  const totalSales = products.reduce((sum, product) => sum + product.sold, 0);
  const revenue = orders.filter((order) => order.paymentStatus === "PAID").reduce((sum, order) => sum + order.total, 0);
  const ordersToday = orders.filter((order) => new Date(order.createdAt).toDateString() === new Date().toDateString()).length;
  const activeListings = products.filter((product) => product.status === "ACTIVE").length;
  const stats = [
    { label: "Total Sales", value: totalSales.toLocaleString(), icon: ShoppingBagOutlinedIcon },
    { label: "Revenue", value: formatKrw(revenue), icon: BarChartOutlinedIcon },
    { label: "Orders Today", value: ordersToday.toLocaleString(), icon: LocalShippingOutlinedIcon },
    { label: "Active Listings", value: activeListings.toLocaleString(), icon: Inventory2OutlinedIcon },
  ];

  return <main className="mnshop-seller-overview"><section className="mnshop-seller-overview__stats">{stats.map((stat) => { const Icon = stat.icon; return <article key={stat.label}><Icon aria-hidden="true" /><p>{stat.label}</p><strong>{stat.value}</strong></article>; })}</section>{isLoading && <p className="mnshop-seller-overview__message" role="status">Loading dashboard…</p>}{!isLoading && loadError && <p className="mnshop-seller-overview__message" role="alert">{loadError}</p>}{!isLoading && !loadError && <section className="mnshop-seller-overview__panels"><article><h2>Recent Activity</h2><div>{orders.slice(0, 4).map((order) => <div className="mnshop-seller-overview__activity" key={order.id}><span><strong>#{order.id.slice(-8).toUpperCase()}</strong><small>{order.items.reduce((sum, item) => sum + item.quantity, 0)} items · {formatKrw(order.total)}</small></span><b className={`mnshop-seller-overview__status mnshop-seller-overview__status--${order.deliveryStatus.toLowerCase()}`}>{order.deliveryStatus}</b></div>)}{orders.length === 0 && <p className="mnshop-seller-overview__empty">No order activity yet.</p>}</div></article><article><h2>Quick Actions</h2><div className="mnshop-seller-overview__actions"><button type="button" onClick={() => history.push("/seller/products")}>Add Product</button><button type="button" onClick={() => history.push("/seller/orders")}>Update Orders</button><button type="button" onClick={() => history.push("/seller/messages")}>Reply Messages</button></div></article></section>}</main>;
}
