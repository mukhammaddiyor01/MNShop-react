const { createProxyMiddleware } = require("http-proxy-middleware");
const express = require("express");
const path = require("path");

module.exports = function configurePortalProxy(app) {
  const sellerBuildDirectory = path.resolve(__dirname, "../src-seller/build");

  // Seller is built with PUBLIC_URL=/seller and served by the buyer dev server.
  // This keeps all browser traffic on :1214 and prevents the seller HMR socket
  // from being captured as a root /ws proxy request.
  app.use("/seller", express.static(sellerBuildDirectory));
  app.get("/seller/*", (_request, response) => {
    response.sendFile(path.join(sellerBuildDirectory, "index.html"));
  });

  app.use(
    "/admin",
    createProxyMiddleware({
      target: "http://localhost:1213",
      changeOrigin: true,
    }),
  );
};
