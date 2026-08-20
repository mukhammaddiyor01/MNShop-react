import axios from "axios";

export type SellerOrder = {
  id: string;
  buyerId: string;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  address: string;
  subtotal: number;
  shippingFee: number;
  total: number;
  status: string;
  paymentStatus: string;
  deliveryStatus: string;
  trackingNumber: string;
  createdAt: string;
  updatedAt: string;
};

type SellerOrderDto = {
  _id: string;
  buyerId?: string;
  orderItems?: Array<{
    productId?: string;
    itemQuantity?: number;
    itemPrice?: number;
  }>;
  orderAddress?: string;
  orderSubtotal?: number;
  orderShippingFee?: number;
  orderTotal?: number;
  orderStatus?: string;
  orderPaymentStatus?: string;
  orderDeliveryStatus?: string;
  orderTrackingNumber?: string;
  createdAt?: string;
  updatedAt?: string;
};

type SellerOrdersResponse = {
  data?: SellerOrderDto[];
};

const serverApi = (
  process.env.REACT_APP_API_URL || "http://localhost:1213"
).replace(/\/$/, "");

const normalizeOrder = (order: SellerOrderDto): SellerOrder => ({
  id: String(order._id),
  buyerId: String(order.buyerId || ""),
  items: (order.orderItems || []).map((item) => ({
    productId: String(item.productId || ""),
    quantity: Number(item.itemQuantity || 0),
    price: Number(item.itemPrice || 0),
  })),
  address: order.orderAddress || "",
  subtotal: Number(order.orderSubtotal || 0),
  shippingFee: Number(order.orderShippingFee || 0),
  total: Number(order.orderTotal || 0),
  status: order.orderStatus || "",
  paymentStatus: order.orderPaymentStatus || "",
  deliveryStatus: order.orderDeliveryStatus || "",
  trackingNumber: order.orderTrackingNumber || "",
  createdAt: order.createdAt || "",
  updatedAt: order.updatedAt || "",
});

class SellerOrderService {
  private readonly path = serverApi;

  public async getMyOrders(): Promise<SellerOrder[]> {
    const result = await axios.get<SellerOrdersResponse>(
      `${this.path}/seller/order/all`,
      { withCredentials: true },
    );

    return (result.data.data || []).map(normalizeOrder);
  }
}

export default SellerOrderService;
