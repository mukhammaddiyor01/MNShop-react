import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const videoUrl =
  "https://videos.pexels.com/video-files/34888657/14781069_1920_1080_30fps.mp4";
const videoFallbackUrl =
  "https://videos.pexels.com/video-files/34888657/14781066_640_360_30fps.mp4";
const posterUrl =
  "https://images.pexels.com/videos/34888657/pexels-photo-34888657.jpeg?auto=compress&cs=tinysrgb&w=1920";

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reducedMotion) {
      video.pause();
      setPlaying(false);
      return;
    }

    video.play().catch(() => setPlaying(false));
  }, []);

  const togglePlayback = async () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      try {
        await video.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
      return;
    }

    video.pause();
    setPlaying(false);
  };

  return (
    <section
      className="mnshop-home-hero theme-dark-content"
      aria-labelledby="mnshop-home-hero-title"
    >
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={posterUrl}
        onCanPlay={() => setLoaded(true)}
        className={`mnshop-home-hero__video${
          loaded ? " mnshop-home-hero__video--loaded" : ""
        }`}
        aria-label="MNShop graphic streetwear screen-print film"
      >
        <source src={videoUrl} type="video/mp4" />
        <source src={videoFallbackUrl} type="video/mp4" />
      </video>

      <div className="mnshop-home-hero__veil" aria-hidden="true" />
      <div className="mnshop-home-hero__side-gradient" aria-hidden="true" />
      <div className="mnshop-home-hero__bottom-gradient" aria-hidden="true" />

      <div className="mnshop-home-hero__inner">
        <div className="mnshop-home-hero__grid">
          <div>
            <p className="mnshop-home-hero__eyebrow">
              Seoul, South Korea / 2026
            </p>
            <h1 id="mnshop-home-hero-title">MNShop</h1>
            <p className="mnshop-home-hero__description">
              Feel the Uzbek vibe in our Products! Bring your ideas into
              Reality! Wear Nationality in your clothes!
            </p>
          </div>

          <div className="mnshop-home-hero__edit">
            <p className="mnshop-home-hero__edit-label">Current edit</p>
            <p className="mnshop-home-hero__edit-title">
              Graphic language, everyday fit.
            </p>
            <div className="mnshop-home-hero__actions">
              <Link to="/products?category=tshirts">
                <span>Graphic T-Shirts</span>
                <ArrowForwardIcon aria-hidden="true" />
              </Link>
              <Link to="/products">
                <span>All Products</span>
                <span>04 categories</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <a
        href="#best-sellers"
        className="mnshop-home-hero__scroll-link"
        aria-label="Best seller mahsulotlariga o'tish"
      >
        Kolleksiyani ko&apos;rish
        <ArrowDownwardIcon aria-hidden="true" />
      </a>

      <button
        type="button"
        className="mnshop-home-hero__playback"
        onClick={togglePlayback}
        aria-label={playing ? "Pause hero video" : "Play hero video"}
        title={playing ? "Pause video" : "Play video"}
      >
        {playing ? (
          <PauseIcon aria-hidden="true" />
        ) : (
          <PlayArrowIcon aria-hidden="true" />
        )}
      </button>
    </section>
  );
}
