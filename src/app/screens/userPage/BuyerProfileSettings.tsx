import axios from "axios";
import AddAPhotoOutlinedIcon from "@mui/icons-material/AddAPhotoOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useGlobals } from "../../hooks/useGlobals";
import BuyerAuthService from "../../services/BuyerAuthService";

const buyerAuthService = new BuyerAuthService();

export function BuyerProfileSettings() {
  const { authUser, setAuthUser } = useGlobals();
  const [fullName, setFullName] = useState(authUser?.fullName || "");
  const [phone, setPhone] = useState(authUser?.phone || "");
  const [avatarPreview, setAvatarPreview] = useState(authUser?.avatar || "");
  const [saveState, setSaveState] = useState<
    "idle" | "saving" | "success" | "error"
  >("idle");
  const [feedback, setFeedback] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File>();
  const previewObjectUrl = useRef<string>();
  const history = useHistory();

  const openAddresses = () => {
    history.push("/user-page/addresses");
  };

  useEffect(() => {
    setFullName(authUser?.fullName || "");
    setPhone(authUser?.phone || "");
    setAvatarPreview(authUser?.avatar || "");
  }, [authUser?.avatar, authUser?.fullName, authUser?.phone]);

  useEffect(() => {
    return () => {
      if (previewObjectUrl.current) {
        URL.revokeObjectURL(previewObjectUrl.current);
      }
    };
  }, []);

  if (!authUser || authUser.role !== "BUYER") return null;

  const initials = authUser.fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const saveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextName = fullName.trim();
    const nextPhone = phone.trim();

    if (!nextName) {
      setSaveState("error");
      setFeedback("Enter the name you want to show on MNShop.");
      return;
    }

    if (nextPhone && !/^[+0-9][0-9 -]{6,}$/.test(nextPhone)) {
      setSaveState("error");
      setFeedback("Enter a valid phone number or leave it blank for now.");
      return;
    }

    setSaveState("saving");
    setFeedback("");

    try {
      const updatedBuyer = await buyerAuthService.updateProfile({
        fullName: nextName,
        phone: nextPhone || undefined,
        image: selectedImage,
      });

      if (previewObjectUrl.current) {
        URL.revokeObjectURL(previewObjectUrl.current);
        previewObjectUrl.current = undefined;
      }

      setSelectedImage(undefined);
      setAuthUser(updatedBuyer);
      setAvatarPreview(updatedBuyer.avatar || "");
      setSaveState("success");
      setFeedback("Profile updated successfully.");
    } catch (error) {
      const responseData = axios.isAxiosError(error)
        ? (error.response?.data as { message?: string } | undefined)
        : undefined;

      setSaveState("error");
      setFeedback(
        responseData?.message ||
          (error instanceof Error
            ? error.message
            : "Profile could not be updated."),
      );
    }
  };

  const logout = async () => {
    if (!window.confirm("Log out of MNShop?")) return;

    setLoggingOut(true);

    try {
      await buyerAuthService.logout();
    } catch (error) {
      console.error("Buyer logout request failed:", error);
    } finally {
      setAuthUser(null);
      history.replace("/login");
    }
  };

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setSaveState("error");
      setFeedback("Choose a JPG or PNG image.");
      event.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setSaveState("error");
      setFeedback("Choose an image smaller than 2 MB.");
      event.target.value = "";
      return;
    }

    if (previewObjectUrl.current) {
      URL.revokeObjectURL(previewObjectUrl.current);
    }

    const nextPreview = URL.createObjectURL(file);
    previewObjectUrl.current = nextPreview;
    setSelectedImage(file);
    setAvatarPreview(nextPreview);
    setSaveState("idle");
    setFeedback("Photo selected. Press Save to update your profile.");
  };

  return (
    <section className="mnshop-buyer-profile-settings">
      <div className="mnshop-buyer-profile-settings__identity">
        <div className="mnshop-buyer-profile-settings__avatar">
          {avatarPreview ? (
            <img alt="Profile" src={avatarPreview} />
          ) : (
            initials || "MN"
          )}
        </div>
        <div>
          <p>{authUser.fullName}</p>
          <p>{authUser.email}</p>
          <p>{authUser.role}</p>
        </div>
      </div>

      <div className="mnshop-buyer-profile-settings__body">
        <form onSubmit={saveProfile}>
          <p className="mnshop-buyer-profile-settings__eyebrow">Edit Profile</p>

          <div className="mnshop-buyer-profile-settings__fields">
            <label>
              <span>Full name</span>
              <input
                type="text"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                autoComplete="name"
                disabled={saveState === "saving"}
              />
            </label>
            <label>
              <span>Phone</span>
              <input
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                autoComplete="tel"
                disabled={saveState === "saving"}
              />
            </label>
          </div>

          {feedback && (
            <p
              className={`mnshop-buyer-profile-settings__feedback is-${saveState}`}
              role={saveState === "error" ? "alert" : "status"}
            >
              {feedback}
            </p>
          )}

          <div className="mnshop-buyer-profile-settings__form-actions">
            <label>
              <AddAPhotoOutlinedIcon aria-hidden="true" />
              Photo
              <input
                accept="image/jpeg,image/png"
                aria-label="Choose profile photo"
                onChange={handlePhotoChange}
                type="file"
                hidden
              />
            </label>
            <button disabled={saveState === "saving"} type="submit">
              <SaveOutlinedIcon aria-hidden="true" />
              {saveState === "saving" ? "Saving..." : "Save"}
            </button>
          </div>
        </form>

        <div className="mnshop-buyer-profile-settings__shortcuts">
          <button onClick={openAddresses} type="button">
            <LocationOnOutlinedIcon aria-hidden="true" />
            My Addresses
            <span>Add, edit, default</span>
          </button>
          <button
            onClick={() => history.push("/user-page/payments")}
            type="button"
          >
            <CreditCardOutlinedIcon aria-hidden="true" />
            Payments
            <span>Stripe, Payme, Click</span>
          </button>
        </div>

        <Link
          to="/orders"
          className="mnshop-buyer-profile-settings__orders-link"
        >
          <Inventory2OutlinedIcon aria-hidden="true" />
          My Orders
        </Link>

        <button
          type="button"
          className="mnshop-buyer-profile-settings__logout"
          disabled={loggingOut}
          onClick={() => void logout()}
        >
          <LogoutIcon aria-hidden="true" />
          {loggingOut ? "Logging out..." : "Log Out"}
        </button>
      </div>
    </section>
  );
}
