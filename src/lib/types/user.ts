import { UserStatus, UserType } from "../enums/user.enum";

export type UserRole = "BUYER" | "SELLER";

export type User = {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
};

export type BuyerSignInInput = {
  userNick: string;
  userPassword: string;
};

export type BuyerSignUpInput = {
  userNick: string;
  userEmail: string;
  userPhone: string;
  userPassword: string;
};

export type GoogleBuyerAuthInput = {
  credential: string;
  userNick?: string;
  userPhone?: string;
};

export type BuyerApiUser = {
  _id?: string;
  id?: string;
  userType?: UserType;
  userStatus?: UserStatus;
  userNick: string;
  userEmail: string;
  userPhone?: string;
  userImage?: string;
};

export type BuyerAuthResponse = {
  user?: BuyerApiUser;
  member?: BuyerApiUser;
};
