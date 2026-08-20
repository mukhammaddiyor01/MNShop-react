import axios from "axios";

export type SellerProfile = {
  id: string;
  nick: string;
  email: string;
  phone: string;
  description: string;
  address: string;
  image: string;
};

type SellerProfileDto = {
  _id: string;
  sellerNick?: string;
  sellerEmail?: string;
  sellerPhone?: string;
  sellerDesc?: string;
  sellerAddress?: string;
  sellerImage?: string;
};

type SellerProfileResponse = { data?: SellerProfileDto };

export type SellerProfileUpdate = Pick<
  SellerProfile,
  "nick" | "email" | "phone" | "description" | "address"
>;

const serverApi = (
  process.env.REACT_APP_API_URL || "http://localhost:1213"
).replace(/\/$/, "");

const normalizeProfile = (seller: SellerProfileDto): SellerProfile => ({
  id: String(seller._id),
  nick: seller.sellerNick || "",
  email: seller.sellerEmail || "",
  phone: seller.sellerPhone || "",
  description: seller.sellerDesc || "",
  address: seller.sellerAddress || "",
  image: seller.sellerImage || "",
});

class SellerProfileService {
  public async getProfile(): Promise<SellerProfile> {
    const result = await axios.get<SellerProfileResponse>(
      `${serverApi}/seller/profile`,
      { withCredentials: true },
    );
    if (!result.data.data) throw new Error("Seller profile was not returned.");
    return normalizeProfile(result.data.data);
  }

  public async updateProfile(
    input: SellerProfileUpdate,
    image?: File | null,
  ): Promise<SellerProfile> {
    const formData = new FormData();
    formData.append("sellerNick", input.nick);
    formData.append("sellerEmail", input.email);
    formData.append("sellerPhone", input.phone);
    formData.append("sellerDesc", input.description);
    formData.append("sellerAddress", input.address);
    if (image) formData.append("sellerImage", image);

    const result = await axios.post<SellerProfileResponse>(
      `${serverApi}/seller/profile/update`,
      formData,
      { withCredentials: true },
    );
    if (!result.data.data) throw new Error("Updated seller profile was not returned.");
    return normalizeProfile(result.data.data);
  }
}

export default SellerProfileService;
