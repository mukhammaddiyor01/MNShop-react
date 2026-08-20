import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../store";

const selectHomePage = (state: RootState) => state.homePage;

export const retrieveHomeProducts = createSelector(
  selectHomePage,
  (homePage) => homePage.products,
);

export const retrieveHomeProductsLoading = createSelector(
  selectHomePage,
  (homePage) => homePage.loading,
);

export const retrieveHomeProductsError = createSelector(
  selectHomePage,
  (homePage) => homePage.error,
);
