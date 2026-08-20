import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../store";

const selectSellerOrdersPage = (state: RootState) => state.sellerOrdersPage;

export const retrieveSellerOrders = createSelector(
  selectSellerOrdersPage,
  (ordersPage) => ordersPage.orders,
);

export const retrieveSellerOrdersLoading = createSelector(
  selectSellerOrdersPage,
  (ordersPage) => ordersPage.loading,
);

export const retrieveSellerOrdersError = createSelector(
  selectSellerOrdersPage,
  (ordersPage) => ordersPage.error,
);
