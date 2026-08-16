import React, { useState } from "react";
import { Badge, IconButton } from "@mui/material";
import { ShoppingBag, FavoriteBorder, Menu, Close, Person } from "@mui/icons-material";
import { Link, NavLink, useHistory } from "react-router-dom";
import { useGlobals } from "../../hooks/useGlobals";

export function Navbar({ home = false }: { home?: boolean }) {
  const g = useGlobals(); const history = useHistory(); const [open,setOpen]=useState(false);
  const protectedGo = (path:string) => g.authMember ? history.push(path) : history.push(`/login?next=${encodeURIComponent(path)}`);
  const links = [{to:"/",label:"Home",exact:true},{to:"/products",label:"Products"},...(g.authMember?[{to:"/orders",label:"Orders"},{to:"/member-page",label:"My Page"}]:[]),{to:"/help",label:"Help"},{to:"/about",label:"About"}];
  return <header className={`site-navbar ${home ? "site-navbar--home" : "site-navbar--other"}`}><div className="site-navbar__inner"><Link to="/" className="site-navbar__brand"><span className="mn-logo"><img src="/icons/Tashqi aylana.png" alt=""/><img src="/icons/Markaziy logo.png" alt="MNShop"/></span><b>MNShop</b></Link><nav className={open?"is-open":""}>{links.map(link=><NavLink exact={link.exact} to={link.to} activeClassName="active" key={link.to} onClick={()=>setOpen(false)}>{link.label}</NavLink>)}</nav><div className="site-navbar__actions"><IconButton aria-label="Likes" onClick={()=>protectedGo("/likes")}><Badge badgeContent={g.likedIds.length} color="primary"><FavoriteBorder/></Badge></IconButton><IconButton aria-label="Cart" onClick={()=>g.authMember?g.setCartOpen(true):protectedGo("/cart")}><Badge badgeContent={g.basket.length} color="primary"><ShoppingBag/></Badge></IconButton>{g.authMember?<Link className="avatar" to="/member-page">{g.authMember.fullName.slice(0,2).toUpperCase()}</Link>:<Link className="login-button" to="/login"><Person/> Login</Link>}<IconButton className="menu-toggle" onClick={()=>setOpen(!open)}>{open?<Close/>:<Menu/>}</IconButton></div></div>{home&&<div className="home-hero"><span className="eyebrow">NEW SEASON · SEOUL 2026</span><h1>Seoul energy.<br/><em>Tashkent soul.</em></h1><p>Premium Korean streetwear curated for a generation that moves differently.</p><Link className="primary-button" to="/products">Explore the drop</Link></div>}</header>;
}
