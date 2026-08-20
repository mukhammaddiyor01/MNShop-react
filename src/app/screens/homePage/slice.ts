import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "../../context/ContextProvider";

type HomePageState = {
  products: Product[];
  loading: boolean;
  error: string;
};

const initialState: HomePageState = {
  products: [],
  loading: false,
  error: "",
};

const homePageSlice = createSlice({
  name: "homePage",
  initialState,
  reducers: {
    setHomeProducts(state, action: PayloadAction<Product[]>) {
      state.products = action.payload;
    },
    setHomeProductsLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setHomeProductsError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
  },
});

export const {
  setHomeProducts,
  setHomeProductsLoading,
  setHomeProductsError,
} = homePageSlice.actions;

export default homePageSlice.reducer;
