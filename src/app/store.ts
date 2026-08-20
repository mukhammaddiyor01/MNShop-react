import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import ordersPageReducer from "./screens/ordersPage/slice";

export const store = configureStore({
  reducer: {
    ordersPage: ordersPageReducer,
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
