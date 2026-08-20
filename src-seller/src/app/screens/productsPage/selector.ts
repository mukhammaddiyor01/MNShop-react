import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../store";

const selectSellerProductsPage = (state: RootState) =>
  state.sellerProductsPage;

export const retrieveSellerProducts = createSelector(
  selectSellerProductsPage,
  (productsPage) => productsPage.products,
);

export const retrieveSellerProductsLoading = createSelector(
  selectSellerProductsPage,
  (productsPage) => productsPage.loading,
);

export const retrieveSellerProductsError = createSelector(
  selectSellerProductsPage,
  (productsPage) => productsPage.error,
);
