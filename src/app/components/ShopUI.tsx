import React, { useMemo, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { Favorite, FavoriteBorder, AddShoppingCart, Close, Remove, Add, ArrowForward } from "@mui/icons-material";
import { useGlobals } from "../hooks/useGlobals";
import { money, products } from "../data/products";
import { Product } from "../context/ContextProvider";

export function ProductCard({ product }: { product: Product }) {
  const globals = useGlobals();
  const history = useHistory();
  const liked = globals.likedIds.includes(product.id);
  const protect = (action: () => void) => globals.authUser ? action() : history.push(`/login?next=${encodeURIComponent(window.location.pathname)}`);
  return <article className="product-card">
    <Link to={`/products/${product.id}`} className="product-card__media"><img src={product.image} alt={product.name}/><img className="product-card__hover" src={product.hoverImage} alt=""/>{product.sale && <span className="product-card__sale">SALE</span>}</Link>
    <button aria-label="Like product" className={`product-card__like ${liked ? "is-liked" : ""}`} onClick={() => protect(() => globals.toggleLike(product.id))}>{liked ? <Favorite/> : <FavoriteBorder/>}</button>
    <div className="product-card__body"><span className="eyebrow">{product.category} · KOREA</span><Link to={`/products/${product.id}`}><h3>{product.name}</h3></Link><div className="product-card__price"><strong>{money(product.price)}</strong>{product.comparePrice && <del>{money(product.comparePrice)}</del>}</div><div className="product-card__foot"><span>{product.views} views · {product.likes} likes</span><button aria-label="Add to cart" onClick={() => protect(() => globals.onAdd(product))}><AddShoppingCart/></button></div></div>
  </article>;
}

export function CartDrawer() {
  const g = useGlobals();
  const subtotal = g.basket.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const delivery = subtotal >= 1000000 || !subtotal ? 0 : 50000;
  return <>{g.cartOpen && <button className="drawer-overlay" onClick={() => g.setCartOpen(false)} aria-label="Close cart"/>}<aside className={`cart-drawer ${g.cartOpen ? "is-open" : ""}`}><header><h2>Your Cart</h2><button onClick={() => g.setCartOpen(false)}><Close/></button></header><div className="cart-drawer__items">{!g.basket.length ? <div className="empty-state"><h3>Your cart is empty</h3><p>Discover the latest Seoul-inspired drop.</p><Link to="/products" onClick={() => g.setCartOpen(false)}>Shop products</Link></div> : g.basket.map((item) => { const key = `${item.product.id}:${item.color}:${item.size}`; return <div className="cart-row" key={key}><img src={item.product.image} alt={item.product.name}/><div><strong>{item.product.name}</strong><small>{item.color} · {item.size}</small><b>{money(item.product.price * item.quantity)}</b><div className="quantity"><button onClick={() => g.onRemove(key)}><Remove/></button><span>{item.quantity}</span><button onClick={() => g.onAdd(item.product, item.color, item.size)}><Add/></button></div></div><button className="cart-row__delete" onClick={() => g.onDelete(key)}><Close/></button></div>; })}</div><footer><div><span>Subtotal</span><b>{money(subtotal)}</b></div><div><span>Shipping</span><b>{delivery ? money(delivery) : "Free"}</b></div><div className="total"><span>Total</span><b>{money(subtotal + delivery)}</b></div><Link to="/checkout" onClick={() => g.setCartOpen(false)} className="primary-button">Checkout <ArrowForward/></Link></footer></aside></>;
}

export function ProductGrid({ list = products }: { list?: Product[] }) { return <div className="product-grid">{list.map((product) => <ProductCard key={product.id} product={product}/>)}</div>; }

export function Catalog() {
  const [category, setCategory] = useState("All"); const [sort, setSort] = useState("featured"); const [search, setSearch] = useState("");
  const list = useMemo(() => products.filter((p) => (category === "All" || p.category === category) && p.name.toLowerCase().includes(search.toLowerCase())).sort((a,b) => sort === "price-low" ? a.price-b.price : sort === "price-high" ? b.price-a.price : b.views-a.views), [category, search, sort]);
  return <main className="page-shell"><section className="catalog-hero"><span className="eyebrow">SEOUL TO TASHKENT</span><h1>Wear the culture.<br/>Own the night.</h1><p>Premium Korean-inspired essentials built for everyday movement.</p></section><section className="catalog"><aside className="filters"><span className="eyebrow">COLLECTION</span>{["All","Hoodies","T-Shirts","Caps","Cups"].map((item) => <button className={category===item ? "active" : ""} onClick={() => setCategory(item)} key={item}>{item}</button>)}</aside><div className="catalog__results"><header><div><span className="eyebrow">THE LATEST DROP</span><h2>All Products <small>{list.length}</small></h2></div><div className="catalog__controls"><input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search products"/><select value={sort} onChange={(e)=>setSort(e.target.value)}><option value="featured">Featured</option><option value="price-low">Price: low</option><option value="price-high">Price: high</option></select></div></header>{list.length ? <ProductGrid list={list}/> : <div className="empty-state"><h3>No products found</h3><button onClick={()=>{setCategory("All");setSearch("")}}>Clear filters</button></div>}</div></section></main>;
}

export function ProductDetails() {
  const { productId } = useParams<{productId:string}>(); const product = products.find((p)=>p.id===productId) || products[0]; const g=useGlobals(); const [color,setColor]=useState(product.colors[0]); const [size,setSize]=useState(product.sizes[0]);
  return <main className="page-shell product-detail"><div className="product-detail__gallery"><img src={product.image} alt={product.name}/><img src={product.hoverImage} alt={`${product.name} alternate`}/></div><section className="product-detail__info"><span className="eyebrow">{product.category} · MADE IN KOREA</span><h1>{product.name}</h1><div className="product-detail__price">{money(product.price)} {product.comparePrice && <del>{money(product.comparePrice)}</del>}</div><p>Premium South Korea-inspired streetwear with a soft handfeel, durable stitching and a clean oversized fit.</p><label>Color</label><div className="swatches">{product.colors.map(c=><button aria-label={c} className={color===c?"active":""} style={{background:c}} onClick={()=>setColor(c)} key={c}/>)}</div><label>Size</label><div className="sizes">{product.sizes.map(s=><button className={size===s?"active":""} onClick={()=>setSize(s)} key={s}>{s}</button>)}</div><button className="primary-button" onClick={()=>{g.onAdd(product,color,size);g.setCartOpen(true)}}>Add to cart <AddShoppingCart/></button><small>{product.stock} pieces in stock · Free delivery over 1,000,000 UZS</small></section></main>;
}
