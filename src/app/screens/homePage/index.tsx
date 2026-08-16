import "../../../css/home.css";
import { Hero } from "./Hero";
import { TrustSection } from "./TrustSection";

export function HomePage() {
  return (
    <main className="mnshop-homepage">
      <Hero />
      <TrustSection />
    </main>
  );
}
