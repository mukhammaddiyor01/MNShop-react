import axios from "axios";

export type SellerAuthInput = {
  sellerNick: string;
  sellerPassword: string;
};

export type SellerSignupInput = SellerAuthInput & {
  sellerEmail: string;
  sellerPhone: string;
};

export type Seller = {
  _id: string;
  sellerNick: string;
  sellerEmail: string;
  sellerPhone: string;
  sellerImage?: string;
  userType: "SELLER";
};

const serverApi = (
  process.env.REACT_APP_API_URL || "http://localhost:1213"
).replace(/\/$/, "");

class SellerAuthService {
  public async signIn(input: SellerAuthInput): Promise<Seller> {
    const result = await axios.post(`${serverApi}/seller/login`, input, {
      withCredentials: true,
    });
    const seller = result.data.seller as Seller;

    localStorage.setItem("sellerData", JSON.stringify(seller));
    return seller;
  }

  public async signUp(input: SellerSignupInput): Promise<Seller> {
    const result = await axios.post(`${serverApi}/seller/signup`, input, {
      withCredentials: true,
    });

    return result.data.seller as Seller;
  }
}

export default SellerAuthService;
