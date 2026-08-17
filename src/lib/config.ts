export const serverApi = (
  process.env.REACT_APP_API_URL || "http://localhost:1213"
).replace(/\/$/, "");

export const sellerPortalUrl = (
  process.env.REACT_APP_SELLER_PORTAL_URL || "http://localhost:1215"
).replace(/\/$/, "");
