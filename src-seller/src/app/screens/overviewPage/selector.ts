import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../store";

const selectSellerOverview = (state: RootState) => state.sellerOverview;

export const retrieveSellerOverviewProducts = createSelector(selectSellerOverview, (overview) => overview.products);
export const retrieveSellerOverviewOrders = createSelector(selectSellerOverview, (overview) => overview.orders);
export const retrieveSellerOverviewLoading = createSelector(selectSellerOverview, (overview) => overview.loading);
export const retrieveSellerOverviewError = createSelector(selectSellerOverview, (overview) => overview.error);
