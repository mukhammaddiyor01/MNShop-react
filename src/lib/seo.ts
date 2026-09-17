import type { Product } from "../app/context/ContextProvider";

export const SITE_URL = "https://mnshop.uz";
export const SITE_DESCRIPTION = "Shop Korean hoodies, T-shirts, caps and cups at MNShop, with delivery to Uzbekistan.";
export type PageMetadata = { title: string; description: string; path: string; noindex?: boolean; image?: string; structuredData?: Record<string, unknown> };
const categories: Record<string, string> = { hoodies: "Hoodies", tshirts: "T-Shirts", caps: "Caps", cups: "Cups", sale: "Sale Collection" };
const topics: Record<string, string> = { delivery: "Delivery", "size-guide": "Size Guide", returns: "Returns", "secure-payment": "Secure Payment", "order-tracking": "Order Tracking", "product-questions": "Product Questions" };

export function getPageMetadata(pathname: string, search = ""): PageMetadata {
  const path = pathname.replace(/\/+$/, "") || "/";
  const base = { title: "MNShop — Korean products for Uzbekistan", description: SITE_DESCRIPTION, path };
  if (path === "/") return { ...base, structuredData: { "@context": "https://schema.org", "@type": "WebSite", name: "MNShop", url: SITE_URL + "/" } };
  if (path === "/products") {
    const value = new URLSearchParams(search).get("category") || "hoodies";
    const category = Object.prototype.hasOwnProperty.call(categories, value) ? value : "hoodies";
    return { ...base, title: `${categories[category]} | MNShop`, description: `Explore the MNShop ${categories[category]} collection. Browse product details, available sizes and colors, and prices in KRW.`, path: `/products?category=${category}` };
  }
  if (path === "/about") return { ...base, title: "About MNShop | Korean products for Uzbekistan", description: "Discover MNShop and our selection of Korean products for shoppers in Uzbekistan." };
  if (path === "/help") return { ...base, title: "Help & Support | MNShop", description: "Find help with MNShop delivery, sizing, returns, payments and order tracking." };
  const parts = path.split("/");
  if (parts.length === 3 && parts[1] === "help" && Object.prototype.hasOwnProperty.call(topics, parts[2])) return { ...base, title: `${topics[parts[2]]} | MNShop Help`, description: `Read MNShop guidance on ${topics[parts[2]].toLowerCase()} and find ways to contact support.` };
  // Personal, authentication, payment and unknown routes are not search landing pages.
  return { ...base, title: "MNShop | Account", noindex: true };
}

export function getProductMetadata(path: string, product: Product | null, loading: boolean): PageMetadata {
  if (!product) return { title: loading ? "Loading product | MNShop" : "Product unavailable | MNShop", description: SITE_DESCRIPTION, path, noindex: !loading };
  const description = product.description.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 160) || `${product.name} from the MNShop ${product.category} collection.`;
  return { title: `${product.name} | MNShop`, description, path, image: product.image,
    structuredData: { "@context": "https://schema.org", "@type": "Product", name: product.name, description, sku: product.id,
      ...(product.image ? { image: new URL(product.image, SITE_URL).href } : {}),
      ...(Number.isFinite(product.price) && product.price > 0 ? { offers: { "@type": "Offer", url: SITE_URL + path, priceCurrency: "KRW", price: product.price, availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock" } } : {}),
    } };
}
