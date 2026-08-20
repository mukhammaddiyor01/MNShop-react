import axios from "axios";

export type SellerProduct = {
  id: string;
  name: string;
  description: string;
  type: string;
  status: string;
  price: number;
  discountPrice?: number;
  images: string[];
  colors: string[];
  sizes: string[];
  stock: number;
  sold: number;
  views: number;
  likes: number;
  rating: number;
  featured: boolean;
  sale: boolean;
};

type SellerProductDto = {
  _id: string;
  productName: string;
  productDesc?: string;
  productType?: string;
  productStatus?: string;
  productPrice?: number;
  productDiscountPrice?: number;
  productImages?: string[];
  productColors?: string[];
  productSizes?: string[];
  productLeftCount?: number;
  productSold?: number;
  productViews?: number;
  productviews?: number;
  productLikes?: number;
  productRating?: number;
  productFeatured?: boolean;
  productSale?: boolean;
};

type SellerProductsResponse = {
  data?: SellerProductDto[];
};

const serverApi = (
  process.env.REACT_APP_API_URL || "http://localhost:1213"
).replace(/\/$/, "");

const toImageUrl = (value: string) =>
  value.startsWith("http")
    ? value
    : `${serverApi}${value.startsWith("/") ? value : `/${value}`}`;

const normalizeProduct = (product: SellerProductDto): SellerProduct => ({
  id: String(product._id),
  name: product.productName,
  description: product.productDesc || "",
  type: product.productType || "",
  status: product.productStatus || "",
  price: Number(product.productPrice || 0),
  discountPrice: product.productDiscountPrice,
  images: (product.productImages || []).map(toImageUrl),
  colors: product.productColors || [],
  sizes: product.productSizes || [],
  stock: Number(product.productLeftCount || 0),
  sold: Number(product.productSold || 0),
  views: Number(product.productViews ?? product.productviews ?? 0),
  likes: Number(product.productLikes || 0),
  rating: Number(product.productRating || 0),
  featured: Boolean(product.productFeatured),
  sale: Boolean(product.productSale),
});

class SellerProductService {
  private readonly path = serverApi;

  public async getMyProducts(): Promise<SellerProduct[]> {
    const result = await axios.get<SellerProductsResponse>(
      `${this.path}/seller/product/all`,
      { withCredentials: true },
    );

    return (result.data.data || []).map(normalizeProduct);
  }
}

export default SellerProductService;
