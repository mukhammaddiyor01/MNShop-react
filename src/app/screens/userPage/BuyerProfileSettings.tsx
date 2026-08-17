import AddAPhotoOutlinedIcon from "@mui/icons-material/AddAPhotoOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useGlobals } from "../../hooks/useGlobals";
import { BuyerAddressManager } from "./BuyerAddressManager";

export function BuyerProfileSettings() {
  const { authUser, setAuthUser } = useGlobals();
  const [fullName, setFullName] = useState(authUser?.fullName || "");
  const [phone, setPhone] = useState(authUser?.phone || "");
  const [avatarPreview, setAvatarPreview] = useState(authUser?.avatar || "");
  const [isAddressesOpen, setIsAddressesOpen] = useState(false);
  const [saveState, setSaveState] = useState<
    "idle" | "saving" | "success" | "error"
  >("idle");
  const [feedback, setFeedback] = useState("");
  const feedbackTimer = useRef<number>();

  useEffect(() => {
    setFullName(authUser?.fullName || "");
    setPhone(authUser?.phone || "");
    setAvatarPreview(authUser?.avatar || "");
  }, [authUser?.avatar, authUser?.fullName, authUser?.phone]);

  useEffect(
    () => () => window.clearTimeout(feedbackTimer.current),
    [],
  );

  if (!authUser || authUser.role !== "BUYER") return null;

  const initials = authUser.fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const saveProfile = (event: FormEvent<HTMLFormElement>) => {
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

    feedbackTimer.current = window.setTimeout(() => {
      setAuthUser((current) =>
        current
          ? {
              ...current,
              fullName: nextName,
              phone: nextPhone || undefined,
            }
          : current,
      );
      setSaveState("success");
      setFeedback("Profile saved on this device.");
    }, 220);
  };

  const logout = () => {
    if (window.confirm("Log out of mnshop_blueprint?")) {
      setAuthUser(null);
    }
  };

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
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

    const reader = new FileReader();
    reader.onload = () => {
      const nextAvatar = typeof reader.result === "string" ? reader.result : "";

      if (!nextAvatar) {
        setSaveState("error");
        setFeedback("The selected image could not be read.");
        return;
      }

      setAvatarPreview(nextAvatar);
      setAuthUser((current) =>
        current ? { ...current, avatar: nextAvatar } : current,
      );
      setSaveState("success");
      setFeedback("Profile photo saved on this device.");
    };
    reader.onerror = () => {
      setSaveState("error");
      setFeedback("The selected image could not be read.");
    };
    reader.readAsDataURL(file);
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
          <p className="mnshop-buyer-profile-settings__eyebrow">
            Edit Profile
          </p>

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
          <button onClick={() => setIsAddressesOpen(true)} type="button">
            <LocationOnOutlinedIcon aria-hidden="true" />
            My Addresses
            <span>Add, edit, default</span>
          </button>
          <button type="button">
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
          onClick={logout}
        >
          <LogoutIcon aria-hidden="true" />
          Log Out
        </button>
      </div>
      <BuyerAddressManager
        isOpen={isAddressesOpen}
        onClose={() => setIsAddressesOpen(false)}
        userId={authUser.id}
        userName={authUser.fullName}
        userPhone={authUser.phone}
      />
    </section>
  );
}
