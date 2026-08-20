import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import sellerProductsPageReducer from "./screens/productsPage/slice";

export const store = configureStore({
  reducer: {
    sellerProductsPage: sellerProductsPageReducer,
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
