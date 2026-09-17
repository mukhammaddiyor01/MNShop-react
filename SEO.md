# MNShop SEO

Canonical production origin: `https://mnshop.uz` (`src/lib/seo.ts`). This is a public URL, not a secret.

- `PageSeo` owns route metadata, canonical links, social tags and JSON-LD.
- Product metadata uses the existing product service result; no additional API request.
- Only real product price/stock are included. Demo reviews/ratings are not structured data.
- `public/sitemap.xml` covers 14 public static/category/help URLs. `yarn build:release` adds public, stocked product URLs to the generated `build/sitemap.xml` using the backend response. Rebuild after catalog changes; this is a release snapshot, not a live sitemap endpoint.
- `robots.txt` permits crawling so crawlers can read noindex. Robots rules are not access control.
- Seller HTML has static noindex. Buyer account/payment/unknown routes receive noindex when React renders. Backend authorization is still required.

## Before production indexing

1. Deploy both builds, serve `robots.txt` and `sitemap.xml` as real static files (not SPA HTML).
2. Redirect HTTP and www to `https://mnshop.uz`, preserving path and query.
3. Configure backend image/API URLs for public HTTPS; localhost upload URLs are not crawlable.
4. Serve the frontend through the updated MNShop backend: it injects page/product metadata before sending HTML, including social tags and JSON-LD. CRA content itself still needs JavaScript. A standalone static host bypasses this SEO controller.
5. The backend returns HTTP 404 for unknown routes/products and server-side noindex headers for private/admin routes. Verify these responses on the deployed host; a proxy must not replace them with a universal 200 SPA fallback.
6. Verify the domain in Google Search Console using its provided DNS TXT record, submit `https://mnshop.uz/sitemap.xml`, and inspect representative public URLs. Ownership verification credentials must come from the domain owner.
7. Language preferences currently share URLs. Do not add hreflang without crawlable language-specific URLs.

Checks: `yarn build:all`, `CI=true yarn test --watchAll=false --runInBand PageSeo.test.tsx`.

No ranking or immediate indexing is guaranteed; no live deployment or Search Console submission has been performed.

## Release build before deployment

Start the backend, then run from this frontend repository (Node.js 18+):

```bash
SEO_PRODUCTS_API_URL=http://localhost:1213/api/products yarn build:release
```

The URL above is used only by the build script, not embedded in the frontend. The script fetches the public catalog before building, fails on invalid/unavailable data, builds buyer and seller with `https://mnshop.uz` as the API origin, and adds real product URLs to the output sitemap. Existing Google client configuration still comes from the build environment. No private .env content is copied to the sitemap.

If the API will use a separate HTTPS origin, explicitly set `RELEASE_API_ORIGIN`. Buyer remains `/`, seller remains `/seller`. Do not replace the release sitemap by running ordinary `yarn build` afterward: ordinary builds copy the static sitemap again.

### Backend integration

The backend now exposes `/api/products`; BuyerProductService uses this route. Legacy `/products` requests still receive JSON unless they explicitly accept HTML, with `Vary: Accept` to separate caches. Browser navigation is rendered by the SEO controller.

`Seo.service.ts` renders public route metadata and real product schema into the built HTML. The controller returns 404 for unknown/missing public products and 503 for unavailable builds/catalog requests. Private/admin/seller/API routes receive server noindex headers. This is HTML metadata injection, not full React server rendering; visible product content still needs JavaScript. HTTPS/www redirects and live Search Console verification remain deployment tasks.
