import { RootState } from "../../store";

export const retrieveSellerSettingsProfile = (state: RootState) => state.sellerSettings.profile;
export const retrieveSellerSettingsLoading = (state: RootState) => state.sellerSettings.loading;
export const retrieveSellerSettingsSaving = (state: RootState) => state.sellerSettings.saving;
export const retrieveSellerSettingsError = (state: RootState) => state.sellerSettings.error;
export const retrieveSellerSettingsSaved = (state: RootState) => state.sellerSettings.saved;
