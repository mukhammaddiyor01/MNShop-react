import axios from "axios";
import { serverApi } from "../../lib/config";
import { Product } from "../context/ContextProvider";

type ApiProduct = {
  _id: string;
  productType?: string;
  productName: string;
  productDesc?: string;
  productPrice: number;
  productDiscountPrice?: number;
  productImages?: string[];
  productColors?: string[];
  productSizes?: string[];
  productLeftCount: number;
  productSold?: number;
  productViews?: number;
  productRating?: number;
  productSale?: boolean;
};

type ProductListResponse = { data?: ApiProduct[] };

const typeLabels: Record<string, string> = {
  HOODIE: "Hoodies",
  TSHIRT: "T-Shirts",
  CAPS: "Caps",
  MUGS: "Cups",
};

const colorValues: Record<string, string> = {
  BLACK: "#0a0a0a",
  WHITE: "#f8fafc",
  RED: "#ef4444",
  BLUE: "#3b82f6",
};

const imageUrl = (value?: string) => {
  if (!value) return "/images/product-placeholder.png";
  return value.startsWith("http") ? value : `${serverApi}${value}`;
};

const normalizeProduct = (product: ApiProduct): Product => {
  const image = imageUrl(product.productImages?.[0]);

  return {
    id: String(product._id),
    name: product.productName,
    category: typeLabels[product.productType || ""] || "Products",
    description: product.productDesc || "Korea-selected MNShop product.",
    price: product.productDiscountPrice || product.productPrice,
    comparePrice: product.productDiscountPrice
      ? product.productPrice
      : undefined,
    image,
    hoverImage: imageUrl(product.productImages?.[1] || product.productImages?.[0]),
    colors: (product.productColors || []).map(
      (color) => colorValues[color] || color.toLowerCase(),
    ),
    sizes: product.productSizes || ["One Size"],
    stock: product.productLeftCount,
    sold: product.productSold || 0,
    sale: Boolean(product.productSale || product.productDiscountPrice),
    views: product.productViews || 0,
    likes: 0,
    rating: product.productRating || 0,
  };
};

class BuyerProductService {
  private readonly path = serverApi;

  public async getProducts(): Promise<Product[]> {
    const result = await axios.get<ProductListResponse>(`${this.path}/products`);
    return (result.data.data || []).map(normalizeProduct);
  }
}

export default BuyerProductService;
