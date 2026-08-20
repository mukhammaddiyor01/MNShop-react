import axios from "axios";
import { serverApi } from "../../lib/config";
import { UserType } from "../../lib/enums/user.enum";
import {
  BuyerAuthResponse,
  GoogleBuyerAuthInput,
  BuyerSignInInput,
  BuyerSignUpInput,
  User,
} from "../../lib/types/user";

function normalizeBuyer(data: BuyerAuthResponse): User {
  const buyer = data.user || data.member;

  if (!buyer) {
    throw new Error("Buyer account was not returned by the server");
  }

  if (buyer.userType && buyer.userType !== UserType.BUYER) {
    throw new Error("A buyer account is required");
  }

  return {
    id: String(buyer._id || buyer.id || buyer.userNick),
    fullName: buyer.userNick,
    email: buyer.userEmail,
    role: UserType.BUYER,
    avatar: buyer.userImage,
    phone: buyer.userPhone,
  };
}

class BuyerAuthService {
  private readonly path: string;

  constructor() {
    this.path = serverApi;
  }

  public async signIn(input: BuyerSignInInput): Promise<User> {
    const result = await axios.post<BuyerAuthResponse>(
      `${this.path}/login`,
      input,
      { withCredentials: true },
    );
    const buyer = normalizeBuyer(result.data);
    localStorage.setItem("userData", JSON.stringify(buyer));
    return buyer;
  }

  public async signUp(input: BuyerSignUpInput): Promise<User> {
    const result = await axios.post<BuyerAuthResponse>(
      `${this.path}/signup`,
      { ...input, userType: UserType.BUYER },
      { withCredentials: true },
    );
    const buyer = normalizeBuyer(result.data);
    localStorage.setItem("userData", JSON.stringify(buyer));
    return buyer;
  }

  public async signInWithGoogle(
    input: GoogleBuyerAuthInput,
  ): Promise<User> {
    const result = await axios.post<BuyerAuthResponse>(
      `${this.path}/auth/google`,
      input,
      { withCredentials: true },
    );
    const buyer = normalizeBuyer(result.data);
    localStorage.setItem("userData", JSON.stringify(buyer));
    return buyer;
  }

  public async getCurrentBuyer(): Promise<User> {
    const result = await axios.get<BuyerAuthResponse>(
      `${this.path}/auth/me`,
      { withCredentials: true },
    );
    const buyer = normalizeBuyer(result.data);
    localStorage.setItem("userData", JSON.stringify(buyer));
    return buyer;
  }

  public async logout(): Promise<void> {
    try {
      await axios.post(
        `${this.path}/logout`,
        {},
        { withCredentials: true },
      );
    } finally {
      localStorage.removeItem("userData");
      localStorage.removeItem("mnshopAuthExpiresAt");
      localStorage.removeItem(["mem", "berData"].join(""));
    }
  }
}

export default BuyerAuthService;
