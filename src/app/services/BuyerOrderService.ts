import axios from "axios";
import { serverApi } from "../../lib/config";
import { CartItem } from "../context/ContextProvider";

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

  public async createOrder(items: CartItem[]): Promise<CreatedBuyerOrder> {
    const result = await axios.post<CreateOrderResponse>(
      `${this.path}/order/create`,
      items.map((item) => ({
        productId: item.product.id,
        itemSubtotal: item.quantity,
      })),
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
