import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { FormEvent, useEffect, useState } from "react";

type BuyerAddress = {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  isDefault: boolean;
};

type AddressDraft = Omit<BuyerAddress, "id" | "isDefault">;

const emptyDraft: AddressDraft = {
  label: "Home",
  fullName: "",
  phone: "",
  address: "",
  city: "",
  zipCode: "",
};

function storageKey(userId: string) {
  return `mnshopAddresses:${userId}`;
}

function readAddresses(userId: string): BuyerAddress[] {
  try {
    const value = localStorage.getItem(storageKey(userId));
    const parsed = value ? JSON.parse(value) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

type BuyerAddressManagerProps = {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
  userPhone?: string;
};

export function BuyerAddressManager({
  isOpen,
  onClose,
  userId,
  userName,
  userPhone,
}: BuyerAddressManagerProps) {
  const [addresses, setAddresses] = useState<BuyerAddress[]>([]);
  const [draft, setDraft] = useState<AddressDraft>(emptyDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    setAddresses(readAddresses(userId));
    setDraft({ ...emptyDraft, fullName: userName, phone: userPhone || "" });
    setEditingId(null);
    setFeedback("");
  }, [isOpen, userId, userName, userPhone]);

  const persist = (nextAddresses: BuyerAddress[]) => {
    setAddresses(nextAddresses);
    localStorage.setItem(storageKey(userId), JSON.stringify(nextAddresses));
  };

  const updateDraft = (key: keyof AddressDraft, value: string) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextDraft = Object.fromEntries(
      Object.entries(draft).map(([key, value]) => [key, value.trim()]),
    ) as AddressDraft;

    if (Object.values(nextDraft).some((value) => !value)) {
      setFeedback("Complete every address field before saving.");
      return;
    }

    if (editingId) {
      persist(
        addresses.map((address) =>
          address.id === editingId ? { ...address, ...nextDraft } : address,
        ),
      );
      setFeedback("Address updated.");
    } else {
      const nextAddress: BuyerAddress = {
        ...nextDraft,
        id: `address-${Date.now()}`,
        isDefault: addresses.length === 0,
      };
      persist([...addresses, nextAddress]);
      onClose();
      return;
    }

    setDraft({ ...emptyDraft, fullName: userName, phone: userPhone || "" });
    setEditingId(null);
  };

  const editAddress = (address: BuyerAddress) => {
    const { id, isDefault, ...nextDraft } = address;
    setDraft(nextDraft);
    setEditingId(id);
    setFeedback("");
  };

  const setDefault = (addressId: string) => {
    persist(
      addresses.map((address) => ({
        ...address,
        isDefault: address.id === addressId,
      })),
    );
    setFeedback("Default address updated.");
  };

  const deleteAddress = (addressId: string) => {
    const remainingAddresses = addresses.filter((address) => address.id !== addressId);
    const hasDefault = remainingAddresses.some((address) => address.isDefault);
    persist(
      remainingAddresses.map((address, index) => ({
        ...address,
        isDefault: hasDefault ? address.isDefault : index === 0,
      })),
    );
    setFeedback("Address removed.");
  };

  if (!isOpen) return null;

  return (
    <div className="mnshop-address-modal" role="presentation">
      <div className="mnshop-address-modal__backdrop" onClick={onClose} />
      <section
        aria-label="My Addresses"
        aria-modal="true"
        className="mnshop-address-modal__panel"
        role="dialog"
      >
        <header>
          <div>
            <p>Delivery details</p>
            <h2>My Addresses</h2>
          </div>
          <button aria-label="Close addresses" onClick={onClose} type="button">
            <CloseIcon aria-hidden="true" />
          </button>
        </header>

        <div className="mnshop-address-modal__content">
          <form onSubmit={handleSubmit}>
            <p className="mnshop-address-modal__form-title">
              {editingId ? "Edit address" : "Add an address"}
            </p>
            <div className="mnshop-address-modal__fields">
              <label>Label<input value={draft.label} onChange={(event) => updateDraft("label", event.target.value)} placeholder="Home" /></label>
              <label>Full name<input value={draft.fullName} onChange={(event) => updateDraft("fullName", event.target.value)} autoComplete="name" /></label>
              <label>Phone<input value={draft.phone} onChange={(event) => updateDraft("phone", event.target.value)} autoComplete="tel" type="tel" /></label>
              <label className="mnshop-address-modal__field-wide">Delivery address<input value={draft.address} onChange={(event) => updateDraft("address", event.target.value)} autoComplete="street-address" /></label>
              <label>City<input value={draft.city} onChange={(event) => updateDraft("city", event.target.value)} autoComplete="address-level2" /></label>
              <label>Zip code<input value={draft.zipCode} onChange={(event) => updateDraft("zipCode", event.target.value)} autoComplete="postal-code" /></label>
            </div>
            <div className="mnshop-address-modal__form-actions">
              {editingId && <button onClick={() => { setEditingId(null); setDraft({ ...emptyDraft, fullName: userName, phone: userPhone || "" }); }} type="button">Cancel</button>}
              <button type="submit">{editingId ? "Save changes" : "Add address"}</button>
            </div>
          </form>

          {feedback && <p className="mnshop-address-modal__feedback" role="status">{feedback}</p>}

          <div className="mnshop-address-modal__list">
            {addresses.length ? addresses.map((address) => (
              <article key={address.id}>
                <div>
                  <p>{address.label} {address.isDefault && <span>Default</span>}</p>
                  <strong>{address.fullName}</strong>
                  <small>{address.phone}</small>
                  <small>{address.address}, {address.city}, {address.zipCode}</small>
                </div>
                <div className="mnshop-address-modal__item-actions">
                  {!address.isDefault && <button onClick={() => setDefault(address.id)} type="button">Set default</button>}
                  <button onClick={() => editAddress(address)} type="button">Edit</button>
                  <button className="is-danger" onClick={() => deleteAddress(address.id)} type="button">Delete</button>
                </div>
              </article>
            )) : <p className="mnshop-address-modal__empty">Add a delivery address for faster checkout.</p>}
          </div>
          <button
            className="mnshop-address-modal__back"
            onClick={onClose}
            type="button"
          >
            <ArrowBackIcon aria-hidden="true" />
            Back to profile
          </button>
        </div>
      </section>
    </div>
  );
}
