import { useEffect } from "react";
import { PageMetadata, SITE_URL } from "../../../lib/seo";

const DEFAULT_SOCIAL_IMAGE = `${SITE_URL}/og/mnshop-preview.jpg`;

export function PageSeo({ metadata }: { metadata: PageMetadata }) {
  const serialized = JSON.stringify(metadata);
  useEffect(() => {
    const page: PageMetadata = JSON.parse(serialized);
    document.title = page.title;
    const meta = (attribute: "name" | "property", key: string, content: string) => {
      let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
      if (!element) { element = document.createElement("meta"); element.setAttribute(attribute, key); document.head.appendChild(element); }
      element.content = content;
    };
    meta("name", "description", page.description);
    meta("name", "robots", page.noindex ? "noindex, follow" : "index, follow, max-image-preview:large");
    meta("property", "og:site_name", "MNShop");
    meta("property", "og:type", "website");
    meta("property", "og:title", page.title);
    meta("property", "og:description", page.description);
    meta("property", "og:url", SITE_URL + page.path);
    meta("name", "twitter:card", "summary_large_image");
    meta("name", "twitter:title", page.title);
    meta("name", "twitter:description", page.description);
    for (const [attribute, key] of [["property", "og:image"], ["name", "twitter:image"]] as const) {
      meta(attribute, key, page.image ? new URL(page.image, SITE_URL).href : DEFAULT_SOCIAL_IMAGE);
    }
    meta("property", "og:image:alt", page.title);
    meta("name", "twitter:image:alt", page.title);
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (page.noindex) canonical?.remove();
    else {
      if (!canonical) { canonical = document.createElement("link"); canonical.rel = "canonical"; document.head.appendChild(canonical); }
      canonical.href = SITE_URL + page.path;
    }
    document.getElementById("mnshop-seo-jsonld")?.remove();
    if (page.structuredData) {
      const script = document.createElement("script");
      script.id = "mnshop-seo-jsonld";
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(page.structuredData).replace(/</g, "\\u003c");
      document.head.appendChild(script);
    }
    return () => { document.getElementById("mnshop-seo-jsonld")?.remove(); };
  }, [serialized]);
  return null;
}
