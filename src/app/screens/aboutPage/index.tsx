import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import { ElementType } from "react";
import { Link } from "react-router-dom";

type SellerStudio = {
  name: string;
  city: string;
  specialty: string;
  image: string;
  products: number;
  rating: string;
};

type AboutValue = {
  icon: ElementType;
  title: string;
  text: string;
};

const sellerStudios: SellerStudio[] = [
  {
    name: "Seoul Studio",
    city: "Seoul, South Korea",
    specialty: "Oversized hoodies and heavyweight T-shirts",
    image:
      "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=900&q=80",
    products: 18,
    rating: "4.9",
  },
  {
    name: "Busan Objects",
    city: "Busan, South Korea",
    specialty: "Caps, cups, and everyday accessories",
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=900&q=80",
    products: 18,
    rating: "4.8",
  },
];

const statistics = [
  ["36+", "Selected products"],
  ["2", "Korean sellers"],
  ["4.8", "Average rating"],
  ["UZ · KR", "One community"],
];

const aboutValues: AboutValue[] = [
  {
    icon: PublicOutlinedIcon,
    title: "Cross-border by design",
    text: "Built around the real needs of Korean sellers and Uzbek buyers.",
  },
  {
    icon: VerifiedUserOutlinedIcon,
    title: "Trust in every order",
    text: "Clear seller identities, order tracking, and buyer-focused support.",
  },
  {
    icon: AutoAwesomeOutlinedIcon,
    title: "Selected, not crowded",
    text: "Focused collections with a clean premium streetwear point of view.",
  },
];

export function AboutPage() {
  return (
    <main className="mnshop-about-page">
      <section className="mnshop-about-hero">
        <img
          src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1800&q=85"
          alt="MNShop Korean streetwear"
          className="mnshop-about-hero__image"
        />
        <div className="mnshop-about-hero__overlay" />
        <div className="mnshop-about-container mnshop-about-hero__inner">
          <div>
            <p className="mnshop-about-eyebrow">Seoul to Uzbekistan</p>
            <h1>We are MNShop.</h1>
            <p className="mnshop-about-hero__description">
              A South Korea-based marketplace connecting Uzbek customers with
              independent streetwear sellers and carefully selected K-culture
              essentials.
            </p>
          </div>
        </div>
      </section>

      <section className="mnshop-about-container mnshop-about-purpose">
        <div>
          <p className="mnshop-about-eyebrow">Our purpose</p>
          <h2>Closer than the distance.</h2>
        </div>
        <div className="mnshop-about-purpose__copy">
          <p>
            MNShop makes Korean streetwear easier to discover, understand, and
            order for customers in Uzbekistan. Every product includes clear
            sizing, stock, seller, and delivery information.
          </p>
          <p>
            Sellers manage their own collections while MNShop provides order
            tracking, secure payments, buyer protection, and direct
            communication in one place.
          </p>
        </div>
      </section>

      <section className="mnshop-about-statistics">
        <div className="mnshop-about-container mnshop-about-statistics__grid">
          {statistics.map(([value, label]) => (
            <div key={label}>
              <strong>{value}</strong>
              <p>{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mnshop-about-container mnshop-about-sellers">
        <div className="mnshop-about-sellers__heading">
          <div>
            <p className="mnshop-about-eyebrow">Our sellers</p>
            <h2>Meet the studios</h2>
          </div>
          <Link to="/products">
            Shop products <ArrowOutwardIcon aria-hidden="true" />
          </Link>
        </div>

        <div className="mnshop-about-sellers__grid">
          {sellerStudios.map((seller) => (
            <article className="mnshop-about-seller" key={seller.name}>
              <div className="mnshop-about-seller__media">
                <img src={seller.image} alt={seller.name} loading="lazy" />
              </div>
              <div className="mnshop-about-seller__content">
                <div>
                  <p className="mnshop-about-seller__location">
                    <LocationOnOutlinedIcon aria-hidden="true" />
                    {seller.city}
                  </p>
                  <h3>{seller.name}</h3>
                  <p className="mnshop-about-seller__specialty">
                    {seller.specialty}
                  </p>
                </div>
                <div className="mnshop-about-seller__metrics">
                  <span>
                    <strong>{seller.products}</strong> <small>products</small>
                  </span>
                  <span>
                    <strong>{seller.rating}</strong> <small>rating</small>
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mnshop-about-values">
        <div className="mnshop-about-container mnshop-about-values__grid">
          {aboutValues.map(({ icon: Icon, title, text }) => (
            <article key={title}>
              <Icon aria-hidden="true" />
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
