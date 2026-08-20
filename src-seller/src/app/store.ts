import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import sellerProductsPageReducer from "./screens/productsPage/slice";
import sellerOrdersPageReducer from "./screens/ordersPage/slice";
import sellerOverviewReducer from "./screens/overviewPage/slice";
import sellerSettingsReducer from "./screens/settingsPage/slice";

export const store = configureStore({
  reducer: {
    sellerProductsPage: sellerProductsPageReducer,
    sellerOrdersPage: sellerOrdersPageReducer,
    sellerOverview: sellerOverviewReducer,
    sellerSettings: sellerSettingsReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
