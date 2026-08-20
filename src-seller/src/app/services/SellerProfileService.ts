import axios from "axios";

export type SellerProfile = {
  id: string;
  nick: string;
  email: string;
  phone: string;
  description: string;
  address: string;
};

type SellerProfileDto = {
  _id: string;
  sellerNick?: string;
  sellerEmail?: string;
  sellerPhone?: string;
  sellerDesc?: string;
  sellerAddress?: string;
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

  public async updateProfile(input: SellerProfileUpdate): Promise<SellerProfile> {
    const result = await axios.post<SellerProfileResponse>(
      `${serverApi}/seller/profile/update`,
      {
        sellerNick: input.nick,
        sellerEmail: input.email,
        sellerPhone: input.phone,
        sellerDesc: input.description,
        sellerAddress: input.address,
      },
      { withCredentials: true },
    );
    if (!result.data.data) throw new Error("Updated seller profile was not returned.");
    return normalizeProfile(result.data.data);
  }
}

export default SellerProfileService;
