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
};

type PreparePaymentResponse = {
  data?: PreparedBuyerPayment;
};

type ConfirmPaymentResponse = {
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

    if (!result.data.data) {
      throw new Error("The server did not return payment setup details");
    }

    return result.data.data;
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
}

export default BuyerPaymentService;
