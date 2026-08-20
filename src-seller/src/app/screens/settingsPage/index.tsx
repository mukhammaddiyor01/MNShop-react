import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import SellerProfileService, { SellerProfileUpdate } from "../../services/SellerProfileService";
import {
  retrieveSellerSettingsError,
  retrieveSellerSettingsLoading,
  retrieveSellerSettingsProfile,
  retrieveSellerSettingsSaved,
  retrieveSellerSettingsSaving,
} from "./selector";
import {
  setSellerSettingsError,
  setSellerSettingsLoading,
  setSellerSettingsProfile,
  setSellerSettingsSaved,
  setSellerSettingsSaving,
} from "./slice";
import "../../../css/settings.css";

const sellerProfileService = new SellerProfileService();

const blankForm: SellerProfileUpdate = {
  nick: "", email: "", phone: "", description: "", address: "",
};

export function SettingsPage() {
  const dispatch = useAppDispatch();
  const profile = useAppSelector(retrieveSellerSettingsProfile);
  const loading = useAppSelector(retrieveSellerSettingsLoading);
  const saving = useAppSelector(retrieveSellerSettingsSaving);
  const error = useAppSelector(retrieveSellerSettingsError);
  const saved = useAppSelector(retrieveSellerSettingsSaved);
  const [form, setForm] = useState<SellerProfileUpdate>(blankForm);

  useEffect(() => {
    let active = true;
    dispatch(setSellerSettingsLoading(true));
    dispatch(setSellerSettingsError(""));
    sellerProfileService.getProfile()
      .then((result) => { if (active) dispatch(setSellerSettingsProfile(result)); })
      .catch(() => { if (active) dispatch(setSellerSettingsError("Your seller profile could not be loaded. Please sign in again.")); })
      .finally(() => { if (active) dispatch(setSellerSettingsLoading(false)); });
    return () => { active = false; };
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setForm({ nick: profile.nick, email: profile.email, phone: profile.phone, description: profile.description, address: profile.address });
    }
  }, [profile]);

  const change = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    if (saved) dispatch(setSellerSettingsSaved(false));
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(setSellerSettingsSaving(true));
    dispatch(setSellerSettingsError(""));
    dispatch(setSellerSettingsSaved(false));
    try {
      const updated = await sellerProfileService.updateProfile(form);
      dispatch(setSellerSettingsProfile(updated));
      dispatch(setSellerSettingsSaved(true));
    } catch {
      dispatch(setSellerSettingsError("We could not save your seller details. Please try again."));
    } finally {
      dispatch(setSellerSettingsSaving(false));
    }
  };

  return <main className="mnshop-seller-settings"><header><span>Seller account</span><h2>Settings</h2><p>Keep the store details your buyers see accurate and up to date.</p></header><form onSubmit={submit}><section className="mnshop-seller-settings__identity"><div className="mnshop-seller-settings__monogram" aria-hidden="true">{(form.nick || "M").slice(0, 1).toUpperCase()}</div><div><strong>{form.nick || "MNShop Seller"}</strong><small>Approved seller account</small></div></section>{loading && <p className="mnshop-seller-settings__notice" role="status">Loading your account details…</p>}{error && <p className="mnshop-seller-settings__notice is-error" role="alert">{error}</p>}<section className="mnshop-seller-settings__fields"><label>Store name<input name="nick" value={form.nick} onChange={change} required maxLength={40} /></label><label>Email address<input name="email" type="email" value={form.email} onChange={change} required /></label><label>Phone number<input name="phone" value={form.phone} onChange={change} maxLength={30} /></label><label>Store location<input name="address" value={form.address} onChange={change} maxLength={100} /></label><label className="mnshop-seller-settings__description">About your store<textarea name="description" value={form.description} onChange={change} maxLength={500} rows={5} placeholder="Tell buyers a little about your store." /></label></section><footer>{saved && <span role="status">Changes saved to your seller account.</span>}<button type="submit" disabled={loading || saving}>{saving ? "Saving…" : "Save changes"}</button></footer></form></main>;
}
