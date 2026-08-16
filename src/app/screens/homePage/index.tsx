import "../../../css/home.css";
import "../../../css/products.css";
import { BestSellers } from "./BestSellers";
import { Hero } from "./Hero";
import { TrustSection } from "./TrustSection";

export function HomePage() {
  return (
    <main className="mnshop-homepage">
      <Hero />
      <BestSellers />
      <TrustSection />
    </main>
  );
}
