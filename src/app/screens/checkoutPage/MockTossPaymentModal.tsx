import CloseIcon from "@mui/icons-material/Close";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { FormEvent, useState } from "react";

type MockTossPaymentModalProps = {
  amount: number;
  currency: string;
  orderName: string;
  error: string;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const formatCardNumber = (value: string) =>
  value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();

const formatExpiry = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  return digits.length > 2
    ? `${digits.slice(0, 2)}/${digits.slice(2)}`
    : digits;
};

export function MockTossPaymentModal({
  amount,
  currency,
  orderName,
  error,
  isSubmitting,
  onClose,
  onConfirm,
}: MockTossPaymentModalProps) {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [cardholder, setCardholder] = useState("");

  const submitPayment = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onConfirm();
  };

  return (
    <div className="mnshop-mock-payment" role="presentation">
      <button
        aria-label="Close test payment"
        className="mnshop-mock-payment__backdrop"
        disabled={isSubmitting}
        onClick={onClose}
        type="button"
      />

      <section
        aria-describedby="mnshop-mock-payment-description"
        aria-labelledby="mnshop-mock-payment-title"
        aria-modal="true"
        className="mnshop-mock-payment__dialog glass"
        role="dialog"
      >
        <header className="mnshop-mock-payment__header">
          <div>
            <span>Development payment</span>
            <h2 id="mnshop-mock-payment-title">MNShop Toss Test Simulator</h2>
          </div>
          <button
            aria-label="Close test payment"
            disabled={isSubmitting}
            onClick={onClose}
            type="button"
          >
            <CloseIcon aria-hidden="true" />
          </button>
        </header>

        <div className="mnshop-mock-payment__summary">
          <CreditCardOutlinedIcon aria-hidden="true" />
          <div>
            <span>{orderName}</span>
            <strong>
              {amount.toLocaleString("en-US")} {currency}
            </strong>
          </div>
        </div>

        <p
          className="mnshop-mock-payment__warning"
          id="mnshop-mock-payment-description"
        >
          Development simulator only. Do not enter real card details. These
          values stay in component memory, are never sent to the server, and
          are discarded when this window closes.
        </p>

        <form onSubmit={submitPayment}>
          <label>
            <span>Test card number</span>
            <input
              autoComplete="off"
              inputMode="numeric"
              maxLength={19}
              onChange={(event) =>
                setCardNumber(formatCardNumber(event.target.value))
              }
              placeholder="0000 0000 0000 0000"
              required
              value={cardNumber}
            />
          </label>

          <div className="mnshop-mock-payment__row">
            <label>
              <span>Expiry</span>
              <input
                autoComplete="off"
                inputMode="numeric"
                maxLength={5}
                onChange={(event) =>
                  setExpiry(formatExpiry(event.target.value))
                }
                placeholder="MM/YY"
                required
                value={expiry}
              />
            </label>
            <label>
              <span>Test CVC</span>
              <input
                autoComplete="off"
                inputMode="numeric"
                maxLength={3}
                onChange={(event) =>
                  setCvc(event.target.value.replace(/\D/g, "").slice(0, 3))
                }
                placeholder="000"
                required
                value={cvc}
              />
            </label>
          </div>

          <label>
            <span>Cardholder name</span>
            <input
              autoComplete="off"
              onChange={(event) => setCardholder(event.target.value)}
              placeholder="TEST BUYER"
              required
              value={cardholder}
            />
          </label>

          {error && (
            <p className="mnshop-mock-payment__error" role="alert">
              {error}
            </p>
          )}

          <button
            className="mnshop-mock-payment__submit"
            disabled={isSubmitting}
            type="submit"
          >
            <LockOutlinedIcon aria-hidden="true" />
            {isSubmitting ? "Processing test payment..." : "Complete test payment"}
          </button>
        </form>
      </section>
    </div>
  );
}
