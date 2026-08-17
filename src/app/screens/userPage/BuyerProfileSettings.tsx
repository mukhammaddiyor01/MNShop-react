import AddAPhotoOutlinedIcon from "@mui/icons-material/AddAPhotoOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useGlobals } from "../../hooks/useGlobals";

export function BuyerProfileSettings() {
  const { authUser, setAuthUser } = useGlobals();
  const [fullName, setFullName] = useState(authUser?.fullName || "");
  const [phone, setPhone] = useState(authUser?.phone || "");
  const [saveState, setSaveState] = useState<
    "idle" | "saving" | "success" | "error"
  >("idle");
  const [feedback, setFeedback] = useState("");
  const feedbackTimer = useRef<number>();

  useEffect(() => {
    setFullName(authUser?.fullName || "");
    setPhone(authUser?.phone || "");
  }, [authUser?.fullName, authUser?.phone]);

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

  return (
    <section className="mnshop-buyer-profile-settings">
      <div className="mnshop-buyer-profile-settings__identity">
        <div className="mnshop-buyer-profile-settings__avatar">
          {initials || "MN"}
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
              <input type="file" accept="image/jpeg,image/png" hidden />
            </label>
            <button disabled={saveState === "saving"} type="submit">
              <SaveOutlinedIcon aria-hidden="true" />
              {saveState === "saving" ? "Saving..." : "Save"}
            </button>
          </div>
        </form>

        <div className="mnshop-buyer-profile-settings__shortcuts">
          <button type="button">
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
    </section>
  );
}
