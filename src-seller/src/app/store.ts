import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import sellerProductsPageReducer from "./screens/productsPage/slice";
import sellerOrdersPageReducer from "./screens/ordersPage/slice";

export const store = configureStore({
  reducer: {
    sellerProductsPage: sellerProductsPageReducer,
    sellerOrdersPage: sellerOrdersPageReducer,
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
