import axios from "axios";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import { Link, Redirect } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import "../../../css/checkout.css";
import { calculateDeliveryFee } from "../../../lib/delivery";
import { CartItem } from "../../context/ContextProvider";
import { money } from "../../data/products";
import { useGlobals } from "../../hooks/useGlobals";
import BuyerOrderService from "../../services/BuyerOrderService";
import BuyerPaymentService, {
  PreparedBuyerPayment,
} from "../../services/BuyerPaymentService";
import { openTossPaymentWindow } from "../../services/TossPaymentWindow";

type CheckoutAddress = {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  isDefault: boolean;
};

type CheckoutStep = 1 | 2 | 3 | 4;

const buyerOrderService = new BuyerOrderService();
const buyerPaymentService = new BuyerPaymentService();

const steps: Array<{
  id: CheckoutStep;
  label: string;
  title: string;
}> = [
  { id: 1, label: "Summary", title: "Review your bag" },
  { id: 2, label: "Delivery", title: "Delivery address" },
  { id: 3, label: "Payment", title: "Payment method" },
  { id: 4, label: "Confirm", title: "Confirm and pay" },
];

const readCheckoutAddresses = (userId: string): CheckoutAddress[] => {
  try {
    const saved = JSON.parse(
      localStorage.getItem(`mnshopAddresses:${userId}`) || "[]",
    );
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
};

const cartKey = (item: CartItem) =>
  `${item.product.id}:${item.color}:${item.size}`;

export function CheckoutPage() {
  const {
    authUser,
    basket,
    setOrderBuilder,
  } = useGlobals();
  const [step, setStep] = useState<CheckoutStep>(1);
  const [addresses, setAddresses] = useState<CheckoutAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [deliveryError, setDeliveryError] = useState("");
  const [createOrderError, setCreateOrderError] = useState("");
  const [paymentWindowError, setPaymentWindowError] = useState("");
  const [createdOrderId, setCreatedOrderId] = useState("");
  const [preparedPayment, setPreparedPayment] =
    useState<PreparedBuyerPayment | null>(null);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [isPreparingPayment, setIsPreparingPayment] = useState(false);

  const subtotal = useMemo(
    () =>
      basket.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0,
      ),
    [basket],
  );
  const deliveryFee = calculateDeliveryFee(subtotal);
  const total = subtotal + deliveryFee;
  const selectedAddress = addresses.find(
    (address) => address.id === selectedAddressId,
  );

  useEffect(() => {
    if (!authUser) return;
    const nextAddresses = readCheckoutAddresses(authUser.id);
    setAddresses(nextAddresses);
    setSelectedAddressId(
      nextAddresses.find((address) => address.isDefault)?.id ||
        nextAddresses[0]?.id ||
        "",
    );
  }, [authUser]);

  useEffect(() => {
    setCreatedOrderId("");
    setPreparedPayment(null);
    setPaymentWindowError("");
    setCreateOrderError("");
  }, [basket, selectedAddressId]);

  if (!authUser) return <Redirect to="/login?next=%2Fcheckout" />;

  if (authUser.role !== "BUYER") {
    return <Redirect to="/" />;
  }

  if (!basket.length) {
    return (
      <main className="mnshop-checkout-page">
        <section className="mnshop-checkout-empty glass">
          <Inventory2OutlinedIcon aria-hidden="true" />
          <h1>Your cart is empty</h1>
          <p>Choose Seoul-inspired products before opening checkout.</p>
          <Link to="/products">Shop products</Link>
        </section>
      </main>
    );
  }

  const setCheckoutStep = (nextStep: CheckoutStep) => {
    if (nextStep > 2 && !selectedAddressId) {
      setStep(2);
      setDeliveryError("Select a delivery address before continuing.");
      return;
    }

    setDeliveryError("");
    setStep(nextStep);
  };

  const continueCheckout = () => {
    const nextStep = Math.min(step + 1, 4) as CheckoutStep;
    setCheckoutStep(nextStep);
  };

  const preparePayment = async (orderId: string) => {
    setCreateOrderError("");
    setPaymentWindowError("");
    setIsPreparingPayment(true);

    try {
      const payment = await buyerPaymentService.preparePayment(orderId);
      setPreparedPayment(payment);
    } catch (error) {
      const responseData = axios.isAxiosError(error)
        ? (error.response?.data as { message?: string } | undefined)
        : undefined;
      setCreateOrderError(
        responseData?.message || "We could not prepare your payment.",
      );
    } finally {
      setIsPreparingPayment(false);
    }
  };

  const createOrder = async () => {
    if (!selectedAddress) {
      setStep(2);
      setDeliveryError("Select a delivery address before creating the order.");
      return;
    }

    setCreateOrderError("");
    setPaymentWindowError("");
    setIsCreatingOrder(true);

    try {
      const order = await buyerOrderService.createOrder(basket, selectedAddress);
      setCreatedOrderId(order.id);
      setOrderBuilder(new Date());
      await preparePayment(order.id);
    } catch (error) {
      const responseData = axios.isAxiosError(error)
        ? (error.response?.data as { message?: string } | undefined)
        : undefined;
      const message = axios.isAxiosError(error)
        ? responseData?.message || "We could not create your order."
        : "We could not create your order.";
      setCreateOrderError(message);
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const requestTossPayment = async () => {
    if (!preparedPayment) return;

    setPaymentWindowError("");
    try {
      await openTossPaymentWindow(preparedPayment, authUser);
    } catch {
      setPaymentWindowError("The Toss test payment window could not be opened.");
    }
  };

  const primaryButtonLabel =
    step < 4
      ? step === 1
        ? "Delivery Info"
        : step === 2
          ? "Payment"
          : "Review Order"
      : isCreatingOrder
        ? "Creating order..."
        : isPreparingPayment
          ? "Preparing payment..."
          : preparedPayment
            ? "Payment ready"
            : createdOrderId
              ? "Retry payment setup"
              : "Create order";

  return (
    <main className="mnshop-checkout-page">
      <section className="mnshop-checkout-shell">
        <div className="mnshop-checkout-heading">
          <h1>Checkout</h1>
          <p>
            Review your cart, choose a delivery address, and finish the order
            through the Toss test payment flow.
          </p>
        </div>

        <div className="mnshop-checkout-grid">
          <section className="mnshop-checkout-panel glass">
            <nav className="mnshop-checkout-steps" aria-label="Checkout steps">
              {steps.map((item) => (
                <button
                  className={step === item.id ? "is-active" : ""}
                  key={item.id}
                  onClick={() => setCheckoutStep(item.id)}
                  type="button"
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="mnshop-checkout-step-title">
              <span>{String(step).padStart(2, "0")}</span>
              <h2>{steps[step - 1].title}</h2>
            </div>

            {step === 1 && (
              <div className="mnshop-checkout-items">
                {basket.map((item) => (
                  <article className="mnshop-checkout-item" key={cartKey(item)}>
                    <img src={item.product.image} alt={item.product.name} />
                    <div>
                      <h3>{item.product.name}</h3>
                      <p>
                        {item.color} · {item.size} · Qty {item.quantity}
                      </p>
                    </div>
                    <strong>{money(item.product.price * item.quantity)}</strong>
                  </article>
                ))}
              </div>
            )}

            {step === 2 && (
              <div className="mnshop-checkout-delivery">
                <LocationOnOutlinedIcon aria-hidden="true" />
                <div className="mnshop-checkout-addresses">
                  {addresses.length ? (
                    addresses.map((address) => (
                      <label
                        className={
                          selectedAddressId === address.id
                            ? "mnshop-checkout-address is-selected"
                            : "mnshop-checkout-address"
                        }
                        key={address.id}
                      >
                        <input
                          checked={selectedAddressId === address.id}
                          name="checkout-address"
                          onChange={() => setSelectedAddressId(address.id)}
                          type="radio"
                        />
                        <span>
                          <strong>
                            {address.label}
                            {address.isDefault ? " · Default" : ""}
                          </strong>
                          <small>
                            {address.fullName} · {address.phone}
                          </small>
                          <small>
                            {address.address}, {address.city}, {address.zipCode}
                          </small>
                        </span>
                      </label>
                    ))
                  ) : (
                    <div className="mnshop-checkout-address-empty">
                      <p>Add a delivery address before checkout.</p>
                      <Link to="/user-page/addresses">Manage addresses</Link>
                    </div>
                  )}
                </div>
                {deliveryError && <p role="alert">{deliveryError}</p>}
              </div>
            )}

            {step === 3 && (
              <div className="mnshop-checkout-payment">
                <CreditCardOutlinedIcon aria-hidden="true" />
                <button className="is-active" type="button">
                  <span>Toss Payments</span>
                  <small>Card · Test mode</small>
                </button>
                <button disabled type="button">
                  <span>Payme</span>
                  <small>Coming after backend method is ready</small>
                </button>
                <button disabled type="button">
                  <span>Click</span>
                  <small>Coming after backend method is ready</small>
                </button>
              </div>
            )}

            {step === 4 && (
              <div className="mnshop-checkout-confirm">
                <TaskAltOutlinedIcon aria-hidden="true" />
                <h2>Confirm and pay</h2>
                <p>
                  The backend will create the real order, prepare Toss payment,
                  and confirm it on the success callback.
                </p>

                {selectedAddress && (
                  <div className="mnshop-checkout-confirm-card">
                    <span>Delivery</span>
                    <strong>{selectedAddress.label}</strong>
                    <small>
                      {selectedAddress.fullName} · {selectedAddress.phone}
                    </small>
                    <small>
                      {selectedAddress.address}, {selectedAddress.city},{" "}
                      {selectedAddress.zipCode}
                    </small>
                  </div>
                )}

                {preparedPayment && (
                  <p className="mnshop-checkout-status" role="status">
                    Payment ready: {preparedPayment.orderName} ·{" "}
                    {preparedPayment.amount} {preparedPayment.currency}
                  </p>
                )}
                {createOrderError && (
                  <p className="mnshop-checkout-error" role="alert">
                    {createOrderError}
                  </p>
                )}
                {paymentWindowError && (
                  <p className="mnshop-checkout-error" role="alert">
                    {paymentWindowError}
                  </p>
                )}
              </div>
            )}

            <div className="mnshop-checkout-actions">
              {step > 1 && !preparedPayment && (
                <button
                  className="mnshop-checkout-secondary"
                  onClick={() => setStep((step - 1) as CheckoutStep)}
                  type="button"
                >
                  Back
                </button>
              )}
              <button
                className="mnshop-checkout-primary"
                disabled={
                  isCreatingOrder || isPreparingPayment || Boolean(preparedPayment)
                }
                onClick={() =>
                  step < 4
                    ? continueCheckout()
                    : createdOrderId
                      ? void preparePayment(createdOrderId)
                      : void createOrder()
                }
                type="button"
              >
                {primaryButtonLabel}
              </button>
              {preparedPayment && (
                <button
                  className="mnshop-checkout-primary"
                  onClick={() => void requestTossPayment()}
                  type="button"
                >
                  Pay with Toss test
                </button>
              )}
            </div>
          </section>

          <aside className="mnshop-checkout-total glass">
            <p>Total</p>
            <strong>{money(total)}</strong>
            <div>
              <span>Subtotal</span>
              <b>{money(subtotal)}</b>
            </div>
            <div>
              <span>Shipping</span>
              <b>{deliveryFee ? money(deliveryFee) : "Free"}</b>
            </div>
            <div>
              <span>Items</span>
              <b>{basket.reduce((sum, item) => sum + item.quantity, 0)}</b>
            </div>
            {selectedAddress && (
              <address>
                <span>Delivery to</span>
                <strong>{selectedAddress.city}</strong>
                <small>{selectedAddress.address}</small>
              </address>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}
