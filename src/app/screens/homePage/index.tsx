import "../../../css/home.css";
import "../../../css/mobile.css";
import "../../../css/products.css";
import { BestSellers } from "./BestSellers";
import { Hero } from "./Hero";
import { ProductSections } from "./ProductSections";
import { TrustSection } from "./TrustSection";

export function HomePage() {
  return (
    <main className="mnshop-homepage">
      <Hero />
      <BestSellers />
      <ProductSections />
      <TrustSection />
    </main>
  );
}
