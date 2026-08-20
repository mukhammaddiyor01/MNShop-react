import axios from "axios";
import { serverApi } from "../../lib/config";

export type PreparedBuyerPayment = {
  orderId: string;
  amount: number;
  currency: string;
  clientKey: string;
  customerKey: string;
  orderName: string;
  successUrl: string;
  failUrl: string;
  mockMode: boolean;
};

type PreparedPaymentResponseData = Omit<
  PreparedBuyerPayment,
  "clientKey" | "mockMode"
> & {
  clientKey?: string;
  mockMode?: boolean;
};

type PreparePaymentResponse = {
  data?: PreparedPaymentResponseData;
};

type ConfirmPaymentResponse = {
  data?: unknown;
};

type MockConfirmPaymentResponse = {
  data?: unknown;
};

class BuyerPaymentService {
  private readonly path = serverApi;

  public async preparePayment(orderId: string): Promise<PreparedBuyerPayment> {
    const result = await axios.post<PreparePaymentResponse>(
      `${this.path}/payment/prepare`,
      { orderId, method: "CARD" },
      { withCredentials: true },
    );

    const payment = result.data.data;

    if (!payment) {
      throw new Error("The server did not return payment setup details");
    }

    if (!payment.mockMode && !payment.clientKey) {
      throw new Error("The server did not return a Toss client key");
    }

    return {
      ...payment,
      clientKey: payment.clientKey || "",
      mockMode: Boolean(payment.mockMode),
    };
  }

  public async confirmPayment(input: {
    paymentKey: string;
    orderId: string;
    amount: number;
  }): Promise<void> {
    await axios.post<ConfirmPaymentResponse>(
      `${this.path}/payment/confirm`,
      input,
      { withCredentials: true },
    );
  }

  public async mockConfirmPayment(orderId: string): Promise<void> {
    await axios.post<MockConfirmPaymentResponse>(
      `${this.path}/payment/mock-confirm`,
      { orderId },
      { withCredentials: true },
    );
  }
}

export default BuyerPaymentService;
