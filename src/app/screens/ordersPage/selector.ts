import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../store";

const selectOrdersPage = (state: RootState) => state.ordersPage;

export const retrieveBuyerOrders = createSelector(
  selectOrdersPage,
  (ordersPage) => ordersPage.orders,
);

export const retrieveBuyerOrdersLoading = createSelector(
  selectOrdersPage,
  (ordersPage) => ordersPage.loading,
);

export const retrieveBuyerOrdersError = createSelector(
  selectOrdersPage,
  (ordersPage) => ordersPage.error,
);
