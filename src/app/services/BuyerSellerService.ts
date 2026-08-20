import axios from "axios";
import { serverApi } from "../../lib/config";

export type SellerStudio = {
  id: string;
  name: string;
  city: string;
  specialty: string;
  image: string;
  products: number;
  rating: number;
};

type ApiSellerStudio = {
  id: string;
  nick: string;
  address?: string;
  description?: string;
  image?: string;
  productCount?: number;
  rating?: number;
};

type SellerStudiosResponse = { data?: ApiSellerStudio[] };

const imageUrl = (value?: string) => {
  if (!value) return "";
  return value.startsWith("http") ? value : `${serverApi}/${value.replace(/^\//, "")}`;
};

class BuyerSellerService {
  public async getSellerStudios(): Promise<SellerStudio[]> {
    const result = await axios.get<SellerStudiosResponse>(`${serverApi}/sellers`);

    return (result.data.data || []).map((seller) => ({
      id: String(seller.id),
      name: seller.nick,
      city: seller.address || "South Korea",
      specialty: seller.description || "Independent MNShop seller.",
      image: imageUrl(seller.image),
      products: Number(seller.productCount || 0),
      rating: Number(seller.rating || 0),
    }));
  }
}

export default BuyerSellerService;
