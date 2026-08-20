import axios from "axios";
import { serverApi } from "../../lib/config";

export type BuyerOrderHistory = {
  _id: string;
  orderTotal: number;
  orderStatus: string;
  orderTrackingNumber?: string;
  createdAt: string;
  orderItems?: Array<{ productId: string; itemQuantity: number }>;
  productData?: Array<{ _id: string; productName: string }>;
};

export type BuyerPaymentHistory = {
  _id: string;
  amount: number;
  currency: string;
  method: string;
  paymentStatus: string;
  providerOrderId: string;
  updatedAt: string;
};

class BuyerHistoryService {
  private readonly path = serverApi;

  public async getOrders(): Promise<BuyerOrderHistory[]> {
    const result = await axios.get<{ data?: BuyerOrderHistory[] }>(
      `${this.path}/order/all?page=1&limit=20`,
      { withCredentials: true },
    );
    return result.data.data || [];
  }

  public async getPayments(): Promise<BuyerPaymentHistory[]> {
    const result = await axios.get<{ data?: BuyerPaymentHistory[] }>(
      `${this.path}/payment/all`,
      { withCredentials: true },
    );
    return result.data.data || [];
  }
}

export default BuyerHistoryService;
