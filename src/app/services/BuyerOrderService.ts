import axios from "axios";
import { serverApi } from "../../lib/config";
import { CartItem } from "../context/ContextProvider";

export type BuyerDeliveryAddress = {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
};

export type CreatedBuyerOrder = {
  id: string;
};

type CreateOrderResponse = {
  data?: {
    _id?: string;
    id?: string;
  };
};

class BuyerOrderService {
  private readonly path = serverApi;

  public async createOrder(
    items: CartItem[],
    deliveryAddress: BuyerDeliveryAddress,
  ): Promise<CreatedBuyerOrder> {
    const result = await axios.post<CreateOrderResponse>(
      `${this.path}/order/create`,
      {
        items: items.map((item) => ({
          productId: item.product.id,
          itemSubtotal: item.quantity,
        })),
        deliveryAddress: [
          deliveryAddress.fullName,
          deliveryAddress.phone,
          deliveryAddress.address,
          deliveryAddress.city,
          deliveryAddress.zipCode,
        ].join(" · "),
      },
      { withCredentials: true },
    );

    const id = result.data.data?._id || result.data.data?.id;

    if (!id) {
      throw new Error("The server did not return an order ID");
    }

    return { id };
  }
}

export default BuyerOrderService;
