import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SellerOrder } from "../../services/SellerOrderService";
import { SellerProduct } from "../../services/SellerProductService";

type SellerOverviewState = {
  products: SellerProduct[];
  orders: SellerOrder[];
  loading: boolean;
  error: string;
};

const initialState: SellerOverviewState = {
  products: [],
  orders: [],
  loading: false,
  error: "",
};

const sellerOverviewSlice = createSlice({
  name: "sellerOverview",
  initialState,
  reducers: {
    setSellerOverviewData(state, action: PayloadAction<Pick<SellerOverviewState, "products" | "orders">>) {
      state.products = action.payload.products;
      state.orders = action.payload.orders;
    },
    setSellerOverviewLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setSellerOverviewError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
  },
});

export const { setSellerOverviewData, setSellerOverviewLoading, setSellerOverviewError } = sellerOverviewSlice.actions;
export default sellerOverviewSlice.reducer;
