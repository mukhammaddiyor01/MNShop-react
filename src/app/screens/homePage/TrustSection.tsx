const trustItems = [
  {
    title: "Direct from Korea",
    description: "Curated Seoul quality",
  },
  {
    title: "Secure checkout",
    description: "Protected payments",
  },
  {
    title: "Fast Uzbekistan delivery",
    description: "Tracked to your door",
  },
];

export function TrustSection() {
  return (
    <section className="mnshop-trust" aria-label="Why shop with MNShop">
      <div className="mnshop-trust__inner">
        <ul className="mnshop-trust__list">
          {trustItems.map((item) => (
            <li key={item.title} className="mnshop-trust__item">
              <h2>{item.title}</h2>
              <p>{item.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
