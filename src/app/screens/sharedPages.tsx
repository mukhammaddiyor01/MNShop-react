import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { ProductGrid } from "../components/ShopUI";
import { products, money } from "../data/products";
import { useGlobals } from "../hooks/useGlobals";
import BuyerOrderService from "../services/BuyerOrderService";

export function HomeContent() { return <main><section className="trust-strip"><div><b>Direct from Korea</b><span>Curated Seoul quality</span></div><div><b>Secure checkout</b><span>Protected payments</span></div><div><b>Fast Uzbekistan delivery</b><span>Tracked to your door</span></div></section><section className="content-section"><div className="section-heading"><span className="eyebrow">CURATED FOR YOU</span><h2>The newest drop</h2><Link to="/products">View all →</Link></div><ProductGrid/></section><section className="brand-story"><span className="eyebrow">OUR BLUEPRINT</span><h2>Two cities.<br/>One street language.</h2><p>MNShop connects Seoul’s design culture with Tashkent’s independent spirit.</p></section></main>; }
const buyerOrderService = new BuyerOrderService();

type CheckoutAddress = {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  isDefault: boolean;
};

const readCheckoutAddresses = (userId: string): CheckoutAddress[] => {
  try {
    const saved = JSON.parse(localStorage.getItem(`mnshopAddresses:${userId}`) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
};

export function CheckoutPage() {
  const g = useGlobals();
  const [step, setStep] = useState(1);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [createOrderError, setCreateOrderError] = useState("");
  const [createdOrderId, setCreatedOrderId] = useState("");
  const [addresses, setAddresses] = useState<CheckoutAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [deliveryError, setDeliveryError] = useState("");
  const subtotal = g.basket.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  useEffect(() => {
    if (!g.authUser) return;
    const nextAddresses = readCheckoutAddresses(g.authUser.id);
    setAddresses(nextAddresses);
    setSelectedAddressId(
      nextAddresses.find((address) => address.isDefault)?.id || nextAddresses[0]?.id || "",
    );
  }, [g.authUser]);

  const continueCheckout = () => {
    if (step === 2 && !selectedAddressId) {
      setDeliveryError("Select a delivery address before continuing.");
      return;
    }

    setDeliveryError("");
    setStep((current) => current + 1);
  };

  const createOrder = async () => {
    const selectedAddress = addresses.find(
      (address) => address.id === selectedAddressId,
    );

    if (!selectedAddress) {
      setStep(2);
      setDeliveryError("Select a delivery address before creating the order.");
      return;
    }

    setCreateOrderError("");
    setIsCreatingOrder(true);

    try {
      const order = await buyerOrderService.createOrder(g.basket, selectedAddress);
      setCreatedOrderId(order.id);
      g.setOrderBuilder(new Date());
    } catch (error) {
      const responseData = axios.isAxiosError(error)
        ? (error.response?.data as { message?: string } | undefined)
        : undefined;
      const message = axios.isAxiosError(error)
        ? responseData?.message || "We could not create your order."
        : "We could not create your order.";
      setCreateOrderError(message);
    } finally {
      setIsCreatingOrder(false);
    }
  };

  if (!g.authUser) return <Redirect to="/login?next=%2Fcheckout" />;

  if (!g.basket.length) {
    return <main className="page-shell"><div className="empty-state"><h2>Your cart is empty</h2><Link to="/products">Start shopping</Link></div></main>;
  }

  return <main className="page-shell narrow"><span className="eyebrow">SECURE CHECKOUT</span><h1>Complete your order</h1><div className="steps">{["Summary", "Delivery", "Payment", "Confirm"].map((label, index) => <span className={step >= index + 1 ? "active" : ""} key={label}>{index + 1}. {label}</span>)}</div><div className="checkout-card">{step === 1 && <><>{g.basket.map((item) => <div className="summary-row" key={`${item.product.id}:${item.color}:${item.size}`}><span>{item.product.name} × {item.quantity}</span><b>{money(item.product.price * item.quantity)}</b></div>)}</><div className="summary-row total"><span>Total</span><b>{money(subtotal)}</b></div></>}{step === 2 && <div className="checkout-addresses">{addresses.length > 0 ? <>{addresses.map((address) => <label className={selectedAddressId === address.id ? "checkout-address is-selected" : "checkout-address"} key={address.id}><input checked={selectedAddressId === address.id} name="delivery-address" onChange={() => setSelectedAddressId(address.id)} type="radio" /><span><strong>{address.label}{address.isDefault ? " · Default" : ""}</strong><small>{address.fullName} · {address.phone}</small><small>{address.address}, {address.city}, {address.zipCode}</small></span></label>)}</> : <div className="empty-state"><p>Add a delivery address before checkout.</p><Link to="/user-page/addresses">Manage addresses</Link></div>}{deliveryError && <p role="alert">{deliveryError}</p>}</div>}{step === 3 && <div className="payment-methods"><button className="active" type="button">Toss Payments · Card</button></div>}{step === 4 && <div className="success-state"><h2>Ready to create your order?</h2><p>The server will verify current prices, stock, delivery and the final total before payment.</p>{createdOrderId && <p role="status">Order created. Payment setup is the next step.</p>}{createOrderError && <p role="alert">{createOrderError}</p>}</div>}<button className="primary-button" type="button" disabled={isCreatingOrder || Boolean(createdOrderId)} onClick={() => step < 4 ? continueCheckout() : void createOrder()}>{step < 4 ? "Continue" : isCreatingOrder ? "Creating order…" : createdOrderId ? "Order created" : "Create order"}</button></div></main>;
}
export function OrdersContent(){const g=useGlobals();if(!g.authUser)return <Redirect to="/login?next=%2Forders"/>;const orders=JSON.parse(localStorage.getItem("mnshopOrders")||"[]");return <main className="page-shell narrow"><span className="eyebrow">YOUR PURCHASES</span><h1>Orders</h1>{orders.length?orders.map((o:any)=><article className="order-card" key={o.id}><header><div><b>{o.id}</b><small>{new Date(o.date).toLocaleDateString()}</small></div><span className={`status status--${o.status}`}>{o.status}</span></header><div className="order-items">{o.items.map((i:any)=><span key={i.product.id}>{i.product.name} × {i.quantity}</span>)}</div><footer><span>Total</span><b>{money(o.total)}</b></footer></article>):<div className="empty-state"><h2>No orders yet</h2><p>Your order history will appear here.</p><Link to="/products">Explore products</Link></div>}</main>}
export function LikesPage(){const g=useGlobals();if(!g.authUser)return <Redirect to="/login?next=%2Flikes"/>;return <main className="page-shell"><div className="section-heading"><div><span className="eyebrow">SAVED FOR LATER</span><h1>Liked products</h1></div></div>{g.likedIds.length?<ProductGrid list={products.filter(p=>g.likedIds.includes(p.id))}/>:<div className="empty-state"><h2>No liked products</h2><Link to="/products">Find your style</Link></div>}</main>}
export function ProfilePage(){const g=useGlobals();if(!g.authUser)return <Redirect to="/login?next=%2Fuser-page"/>;return <main className="page-shell narrow"><span className="eyebrow">MY PAGE</span><h1>{g.authUser.fullName}</h1><div className="profile-card"><div className="profile-avatar">{g.authUser.fullName.slice(0,2)}</div><input defaultValue={g.authUser.fullName}/><input defaultValue={g.authUser.email}/><input placeholder="Phone"/><input placeholder="Address"/><button className="primary-button">Save profile</button><button className="danger-button" onClick={()=>g.setAuthUser(null)}>Log out</button></div></main>}
export function InfoPage({about=false}:{about?:boolean}){return <main className="page-shell narrow"><span className="eyebrow">{about?"OUR STORY":"MNShop SUPPORT"}</span><h1>{about?"Seoul design, Tashkent spirit.":"How can we help?"}</h1><div className="info-grid">{(about?["Korean quality","Uzbek community","Independent culture"]:["How does delivery work?","Can I exchange a size?","How can I track my order?"]).map((x,i)=><article key={x}><b>{String(i+1).padStart(2,"0")}</b><h3>{x}</h3><p>Everything you need to know about MNShop products, ordering and customer care.</p></article>)}</div></main>}
