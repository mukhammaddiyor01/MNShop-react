import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BuyerOrderHistory } from "../../services/BuyerHistoryService";

type OrdersPageState = {
  orders: BuyerOrderHistory[];
  loading: boolean;
  error: string;
};

const initialState: OrdersPageState = {
  orders: [],
  loading: false,
  error: "",
};

const ordersPageSlice = createSlice({
  name: "ordersPage",
  initialState,
  reducers: {
    setBuyerOrders(state, action: PayloadAction<BuyerOrderHistory[]>) {
      state.orders = action.payload;
    },
    setBuyerOrdersLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setBuyerOrdersError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
  },
});

export const {
  setBuyerOrders,
  setBuyerOrdersLoading,
  setBuyerOrdersError,
} = ordersPageSlice.actions;

export default ordersPageSlice.reducer;
