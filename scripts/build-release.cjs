// Run only when the backend public catalog is available. Never reads database credentials.
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const origin = "https://mnshop.uz";
const root = path.resolve(__dirname, "..");
const escapeXml = value => String(value).replace(/[<>&"']/g, char => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" })[char]);

function productUrls(payload) {
  if (!payload || !Array.isArray(payload.data)) throw new Error("Public catalog response must contain a data array.");
  const urls = new Set();
  for (const product of payload.data) {
    if (!/^[a-f\d]{24}$/i.test(String(product._id))) throw new Error("Public catalog contains an invalid product ID.");
    if (product.productStatus && product.productStatus !== "ACTIVE") continue;
    // Match the backend public catalog's current stock policy.
    if (!(Number(product.productLeftCount) > 0)) continue;
    urls.add(`${origin}/products/${product._id}`);
  }
  return [...urls];
}

async function main() {
  if (typeof fetch !== "function") throw new Error("Node.js 18+ is required.");
  const source = process.env.SEO_PRODUCTS_API_URL;
  if (!source) throw new Error("Set SEO_PRODUCTS_API_URL to the running backend public products endpoint before release. No incomplete release will be built.");
  const url = new URL(source);
  if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) throw new Error("Use an HTTP(S) public catalog URL without embedded credentials.");
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  let payload;
  try {
    const response = await fetch(url, { headers: { Accept: "application/json" }, signal: controller.signal });
    if (!response.ok) throw new Error(`Public catalog request failed (${response.status}).`);
    payload = await response.json();
  } finally { clearTimeout(timeout); }
  const urls = productUrls(payload);
  const apiOrigin = process.env.RELEASE_API_ORIGIN || origin;
  const api = new URL(apiOrigin);
  if (api.protocol !== "https:" || api.username || api.password || api.pathname !== "/" || api.search || api.hash || api.hostname === "localhost" || api.hostname === "127.0.0.1") {
    throw new Error("RELEASE_API_ORIGIN must be a public HTTPS origin without path or credentials.");
  }
  const build = spawnSync("yarn", ["build:all"], { cwd: root, stdio: "inherit", env: {
    ...process.env,
    REACT_APP_API_URL: api.origin,
    REACT_APP_SELLER_PORTAL_URL: origin,
    PUBLIC_URL: "/",
  } });
  if (build.error) throw build.error;
  if (build.status !== 0) throw new Error("Frontend build failed.");
  const sitemap = fs.readFileSync(path.join(root, "public/sitemap.xml"), "utf8");
  if (!sitemap.includes("</urlset>")) throw new Error("Static sitemap is invalid.");
  const entries = urls.map(value => `  <url><loc>${escapeXml(value)}</loc></url>`).join("\n");
  fs.writeFileSync(path.join(root, "build/sitemap.xml"), sitemap.replace("</urlset>", `${entries}\n</urlset>`));
  console.log(`Release built for ${origin}; ${urls.length} product URLs added to sitemap. Nothing has been deployed.`);
}

module.exports = { productUrls, escapeXml };
if (require.main === module) main().catch(error => { console.error(error.message); process.exitCode = 1; });
