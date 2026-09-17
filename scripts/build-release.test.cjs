const test = require("node:test");
const assert = require("node:assert/strict");
const { productUrls, escapeXml } = require("./build-release.cjs");
test("only public stocked products, unique valid URLs", () => {
  const active = { _id: "1234567890abcdef12345678", productStatus: "ACTIVE", productLeftCount: 4 };
  assert.deepEqual(productUrls({ data: [active, active, { ...active, productStatus: "DELETE" }, { ...active, productLeftCount: 0 }] }), ["https://mnshop.uz/products/1234567890abcdef12345678"]);
});
test("invalid payloads cannot silently generate a release sitemap", () => {
  assert.throws(() => productUrls({}));
  assert.throws(() => productUrls({ data: [{ _id: "fake-product" }] }));
});
test("XML values are escaped", () => assert.equal(escapeXml('a&b<c'), "a&amp;b&lt;c"));
