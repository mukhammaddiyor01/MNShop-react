import { PreparedBuyerPayment } from "./BuyerPaymentService";

type TossPaymentInstance = {
  requestPayment: (input: Record<string, unknown>) => Promise<void>;
};

type TossPaymentsFactory = (clientKey: string) => {
  payment: (input: { customerKey: string }) => TossPaymentInstance;
};

declare global {
  interface Window {
    TossPayments?: TossPaymentsFactory;
  }
}

const sdkUrl = "https://js.tosspayments.com/v2/standard";

const loadSdk = () =>
  new Promise<void>((resolve, reject) => {
    if (window.TossPayments) {
      resolve();
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${sdkUrl}"]`,
    );
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Toss SDK failed to load")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = sdkUrl;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Toss SDK failed to load"));
    document.head.appendChild(script);
  });

export async function openTossPaymentWindow(
  payment: PreparedBuyerPayment,
  buyer: { fullName: string; email: string },
) {
  await loadSdk();

  if (!window.TossPayments) {
    throw new Error("Toss Payments is unavailable");
  }

  const tossPayment = window.TossPayments(payment.clientKey).payment({
    customerKey: payment.customerKey,
  });

  await tossPayment.requestPayment({
    method: "CARD",
    amount: { value: payment.amount, currency: payment.currency },
    orderId: payment.orderId,
    orderName: payment.orderName,
    successUrl: payment.successUrl,
    failUrl: payment.failUrl,
    customerName: buyer.fullName,
    customerEmail: buyer.email,
  });
}
