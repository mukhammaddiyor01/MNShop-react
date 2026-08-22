import axios from "axios";

export type SellerOrder = {
  id: string;
  buyerId: string;
  items: Array<{
    productId: string;
    name: string;
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

export type DeliveryStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "FAILED";

type SellerOrderDto = {
  _id: string;
  buyerId?: string;
  orderItems?: Array<{
    productId?: string;
    itemQuantity?: number;
    itemSubtotal?: number;
    itemPrice?: number;
  }>;
  productData?: Array<{
    _id?: string;
    productName?: string;
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
    name: (order.productData || []).find(
      (product) => String(product._id) === String(item.productId),
    )?.productName || "Product",
    quantity: Number(item.itemQuantity ?? item.itemSubtotal ?? 0),
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

  public async updateDeliveryStatus(
    orderId: string,
    deliveryStatus: DeliveryStatus,
    trackingNumber?: string,
  ): Promise<SellerOrder> {
    const result = await axios.post<{ data: SellerOrderDto }>(
      `${this.path}/seller/order/${orderId}/delivery`,
      { deliveryStatus, trackingNumber },
      { withCredentials: true },
    );

    return normalizeOrder(result.data.data);
  }
}

export default SellerOrderService;
