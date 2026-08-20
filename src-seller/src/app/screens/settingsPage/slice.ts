import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SellerProfile } from "../../services/SellerProfileService";

type SellerSettingsState = {
  profile: SellerProfile | null;
  loading: boolean;
  saving: boolean;
  error: string;
  saved: boolean;
};

const initialState: SellerSettingsState = {
  profile: null,
  loading: false,
  saving: false,
  error: "",
  saved: false,
};

const sellerSettingsSlice = createSlice({
  name: "sellerSettings",
  initialState,
  reducers: {
    setSellerSettingsProfile(state, action: PayloadAction<SellerProfile>) {
      state.profile = action.payload;
    },
    setSellerSettingsLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setSellerSettingsSaving(state, action: PayloadAction<boolean>) {
      state.saving = action.payload;
    },
    setSellerSettingsError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
    setSellerSettingsSaved(state, action: PayloadAction<boolean>) {
      state.saved = action.payload;
    },
  },
});

export const {
  setSellerSettingsProfile,
  setSellerSettingsLoading,
  setSellerSettingsSaving,
  setSellerSettingsError,
  setSellerSettingsSaved,
} = sellerSettingsSlice.actions;

export default sellerSettingsSlice.reducer;
