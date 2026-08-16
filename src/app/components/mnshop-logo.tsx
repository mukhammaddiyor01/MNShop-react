const logoSizes = {
  sm: "mnshop-logo--sm",
  md: "mnshop-logo--md",
  lg: "mnshop-logo--lg",
  xl: "mnshop-logo--xl",
  auth: "mnshop-logo--auth",
  hero: "mnshop-logo--hero",
} as const;

type MnshopLogoProps = {
  size?: keyof typeof logoSizes;
  className?: string;
};

export function MnshopLogo({
  size = "md",
  className = "",
}: MnshopLogoProps) {
  return (
    <span
      aria-hidden="true"
      className={`mnshop-logo mnshop-logo-shine ${logoSizes[size]} ${className}`.trim()}
    >
      <img
        src="/icons/Tashqi aylana.png"
        alt=""
        className="mnshop-logo__image mnshop-logo-outer"
      />
      <img
        src="/icons/Markaziy logo.png"
        alt=""
        className="mnshop-logo__image mnshop-logo-center"
      />
    </span>
  );
}
