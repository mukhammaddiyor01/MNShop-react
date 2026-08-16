import { Link } from "react-router-dom";

export function Hero() {
  return (
    <section className="mnshop-hero" aria-labelledby="mnshop-hero-title">
      <video
        className="mnshop-hero__video"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        aria-hidden="true"
        tabIndex={-1}
      >
        <source src="/video/mnshop-product-hero.mp4" type="video/mp4" />
      </video>

      <div className="mnshop-hero__overlay" aria-hidden="true" />

      <div className="mnshop-hero__content">
        <p className="mnshop-hero__eyebrow">New season · Seoul 2026</p>

        <h1 id="mnshop-hero-title" className="mnshop-hero__title">
          Seoul energy.
          <span>Tashkent soul.</span>
        </h1>

        <p className="mnshop-hero__description">
          Premium Korean streetwear curated for a generation that moves
          differently.
        </p>

        <Link to="/products" className="mnshop-hero__cta">
          Explore the drop
        </Link>
      </div>
    </section>
  );
}
