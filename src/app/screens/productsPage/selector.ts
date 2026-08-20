import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../store";

const selectProductsPage = (state: RootState) => state.productsPage;

export const retrieveCatalogProducts = createSelector(
  selectProductsPage,
  (productsPage) => productsPage.products,
);

export const retrieveCatalogProductsLoading = createSelector(
  selectProductsPage,
  (productsPage) => productsPage.loading,
);

export const retrieveCatalogProductsError = createSelector(
  selectProductsPage,
  (productsPage) => productsPage.error,
);
