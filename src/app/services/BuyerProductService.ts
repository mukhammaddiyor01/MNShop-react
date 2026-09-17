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
  productLikes?: number;
  productRating?: number;
  productSale?: boolean;
};

type ProductListResponse = { data?: ApiProduct[] };
type ProductResponse = { data?: ApiProduct };
type LikeToggleResponse = { data?: { isLiked?: boolean; productLikes?: number } };
type LikedProductsResponse = { data?: string[] };

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
    colors: (product.productColors || []).map((color) => {
      const normalizedColor = String(color).trim().toUpperCase();
      return colorValues[normalizedColor] || String(color).trim().toLowerCase();
    }),
    sizes: product.productSizes || ["One Size"],
    stock: product.productLeftCount,
    sold: product.productSold || 0,
    sale: Boolean(product.productSale || product.productDiscountPrice),
    views: product.productViews || 0,
    likes: product.productLikes || 0,
    rating: product.productRating || 0,
  };
};

class BuyerProductService {
  private readonly path = serverApi;

  public async getProducts(): Promise<Product[]> {
    const result = await axios.get<ProductListResponse>(`${this.path}/api/products`);
    return (result.data.data || []).map(normalizeProduct);
  }

  public async registerProductView(productId: string): Promise<Product> {
    const result = await axios.post<ProductResponse>(
      `${this.path}/product/${productId}/view`,
      undefined,
      { withCredentials: true },
    );

    if (!result.data.data) throw new Error("Product view response is missing.");
    return normalizeProduct(result.data.data);
  }

  public async toggleLike(productId: string): Promise<{ isLiked: boolean; productLikes: number }> {
    const result = await axios.post<LikeToggleResponse>(
      `${this.path}/product/${productId}/like`,
      undefined,
      { withCredentials: true },
    );

    return {
      isLiked: Boolean(result.data.data?.isLiked),
      productLikes: Number(result.data.data?.productLikes || 0),
    };
  }

  public async getMyLikedProductIds(): Promise<string[]> {
    const result = await axios.get<LikedProductsResponse>(
      `${this.path}/product/likes`,
      { withCredentials: true },
    );

    return (result.data.data || []).map(String);
  }
}

export default BuyerProductService;
