import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import { useEffect, useState } from "react";

export type CatalogHero = {
  images: string[];
  eyebrow: string;
  title: string;
  description: string;
  sale?: boolean;
};

type CatalogHeroSliderProps = {
  hero: CatalogHero;
};

export function CatalogHeroSlider({ hero }: CatalogHeroSliderProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    setIndex(0);
  }, [hero.title]);

  useEffect(() => {
    if (paused || hero.images.length < 2) return;

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % hero.images.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [hero.images.length, paused]);

  const move = (direction: number) => {
    setIndex(
      (current) =>
        (current + direction + hero.images.length) % hero.images.length,
    );
  };

  return (
    <section
      className="mnshop-catalog-hero"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-labelledby="catalog-hero-title"
    >
      <img
        key={hero.images[index]}
        src={hero.images[index]}
        alt={`${hero.title} collection ${index + 1}`}
        className="mnshop-catalog-hero__image"
      />

      <div className="mnshop-catalog-hero__veil" aria-hidden="true" />
      <div className="mnshop-catalog-hero__gradient" aria-hidden="true" />

      <div className="mnshop-catalog-hero__inner">
        <div className="mnshop-catalog-hero__content">
          <div>
            <p className="mnshop-catalog-hero__eyebrow">
              {hero.sale && (
                <LocalFireDepartmentIcon aria-hidden="true" />
              )}
              {hero.eyebrow}
            </p>
            <h1 id="catalog-hero-title">{hero.title}</h1>
          </div>
          <p className="mnshop-catalog-hero__description">
            {hero.description}
          </p>
        </div>
      </div>

      <button
        type="button"
        className="mnshop-catalog-hero__previous"
        onClick={() => move(-1)}
        aria-label="Oldingi hero rasmi"
        title="Oldingi rasm"
      >
        <ChevronLeftIcon aria-hidden="true" />
      </button>
      <button
        type="button"
        className="mnshop-catalog-hero__next"
        onClick={() => move(1)}
        aria-label="Keyingi hero rasmi"
        title="Keyingi rasm"
      >
        <ChevronRightIcon aria-hidden="true" />
      </button>

      <div className="mnshop-catalog-hero__indicators">
        {hero.images.map((image, slideIndex) => (
          <button
            key={image}
            type="button"
            className={
              slideIndex === index
                ? "mnshop-catalog-hero__indicator mnshop-catalog-hero__indicator--active"
                : "mnshop-catalog-hero__indicator"
            }
            onClick={() => setIndex(slideIndex)}
            aria-label={`${slideIndex + 1}-hero rasmini ko'rish`}
          />
        ))}
      </div>
    </section>
  );
}
