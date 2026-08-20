import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SellerOrder } from "../../services/SellerOrderService";

type SellerOrdersPageState = {
  orders: SellerOrder[];
  loading: boolean;
  error: string;
};

const initialState: SellerOrdersPageState = {
  orders: [],
  loading: false,
  error: "",
};

const sellerOrdersPageSlice = createSlice({
  name: "sellerOrdersPage",
  initialState,
  reducers: {
    setSellerOrders(state, action: PayloadAction<SellerOrder[]>) {
      state.orders = action.payload;
    },
    replaceSellerOrder(state, action: PayloadAction<SellerOrder>) {
      state.orders = state.orders.map((order) =>
        order.id === action.payload.id ? action.payload : order,
      );
    },
    setSellerOrdersLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setSellerOrdersError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
  },
});

export const {
  setSellerOrders,
  replaceSellerOrder,
  setSellerOrdersLoading,
  setSellerOrdersError,
} = sellerOrdersPageSlice.actions;

export default sellerOrdersPageSlice.reducer;
