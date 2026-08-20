const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function configureSellerPortalProxy(app) {
  app.use(
    "/seller",
    createProxyMiddleware({
      target: "http://localhost:1215",
      changeOrigin: true,
      ws: true,
    }),
  );
};
