import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { PageSeo } from "./PageSeo";
import { getPageMetadata, getProductMetadata, SITE_URL } from "../../../lib/seo";
import type { Product } from "../../context/ContextProvider";

test("category canonical keeps category but drops tracking parameters", () => {
  expect(getPageMetadata("/products", "?category=caps&utm_source=test").path).toBe("/products?category=caps");
  expect(getPageMetadata("/products", "?category=__proto__").path).toBe("/products?category=hoodies");
  expect(getPageMetadata("/about/").path).toBe("/about");
});

test("personal and unknown routes are noindex", () => {
  ["/login", "/signup", "/user-page", "/orders", "/cart", "/checkout", "/likes", "/chat", "/payment/success", "/missing"].forEach(path => {
    expect(getPageMetadata(path).noindex).toBe(true);
  });
  expect(getPageMetadata("/help/delivery").noindex).toBeUndefined();
});

test("product schema uses actual price and stock without invented reviews", () => {
  const product = { id: "abc", name: "Test Hoodie", description: "A cotton hoodie", category: "Hoodies", image: "/photo.webp", price: 34000, stock: 0 } as Product;
  const metadata = getProductMetadata("/products/abc", product, false);
  expect(metadata.title).toBe("Test Hoodie | MNShop");
  expect(metadata.structuredData).toMatchObject({ image: SITE_URL + "/photo.webp", offers: { price: 34000, priceCurrency: "KRW", availability: "https://schema.org/OutOfStock" } });
  expect(metadata.structuredData).not.toHaveProperty("aggregateRating");
  expect(getProductMetadata("/products/abc", null, false).noindex).toBe(true);
  expect(getProductMetadata("/products/abc", null, true).noindex).toBe(false);
});

test("navigation replaces metadata and removes stale schema and canonical", () => {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const environment = globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean };
  const previous = environment.IS_REACT_ACT_ENVIRONMENT;
  environment.IS_REACT_ACT_ENVIRONMENT = true;
  const root = createRoot(container);
  const render = (path: string) => act(() => { root.render(<PageSeo metadata={getPageMetadata(path)} />); });
  render("/");
  expect(document.getElementById("mnshop-seo-jsonld")).not.toBeNull();
  render("/login");
  expect(document.getElementById("mnshop-seo-jsonld")).toBeNull();
  expect(document.head.querySelector('link[rel="canonical"]')).toBeNull();
  expect(document.head.querySelector('meta[name="robots"]')?.getAttribute("content")).toBe("noindex, follow");
  render("/about");
  expect(document.head.querySelector('link[rel="canonical"]')?.getAttribute("href")).toBe(SITE_URL + "/about");
  expect(document.head.querySelectorAll('meta[name="description"]')).toHaveLength(1);
  act(() => root.unmount());
  environment.IS_REACT_ACT_ENVIRONMENT = previous;
  container.remove();
});
