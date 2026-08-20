import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SellerProduct } from "../../services/SellerProductService";

type SellerProductsPageState = {
  products: SellerProduct[];
  loading: boolean;
  error: string;
};

const initialState: SellerProductsPageState = {
  products: [],
  loading: false,
  error: "",
};

const sellerProductsPageSlice = createSlice({
  name: "sellerProductsPage",
  initialState,
  reducers: {
    setSellerProducts(state, action: PayloadAction<SellerProduct[]>) {
      state.products = action.payload;
    },
    setSellerProductsLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setSellerProductsError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
  },
});

export const {
  setSellerProducts,
  setSellerProductsLoading,
  setSellerProductsError,
} = sellerProductsPageSlice.actions;

export default sellerProductsPageSlice.reducer;
