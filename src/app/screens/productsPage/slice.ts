import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "../../context/ContextProvider";

type ProductsPageState = {
  products: Product[];
  loading: boolean;
  error: string;
};

const initialState: ProductsPageState = {
  products: [],
  loading: false,
  error: "",
};

const productsPageSlice = createSlice({
  name: "productsPage",
  initialState,
  reducers: {
    setCatalogProducts(state, action: PayloadAction<Product[]>) {
      state.products = action.payload;
    },
    setCatalogProductsLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setCatalogProductsError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
  },
});

export const {
  setCatalogProducts,
  setCatalogProductsLoading,
  setCatalogProductsError,
} = productsPageSlice.actions;

export default productsPageSlice.reducer;
