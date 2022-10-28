import { Account } from "../account/account.model";

export interface Customer {
  id?: number;
  customerName?: string;
  phoneNumber?: string;
  birthday?: string;
  image?: string;
  gender?: number;
  email?: string;
  customerType?: number;
  citizenIdentifyCart?: string;
  ctime?: Date;
  mtime?: Date;
  status?: string;
  account?: Account;
}

export interface CustomerDTO{
  customerName?: string;
  phoneNumber?: string;
  birthday?: string;
  image?: string;
  gender?: number;
  email?: string;
  customerType?: number;
  citizenIdentifyCart?: string;
  ctime?: Date;
  mtime?: Date;
  status?: string;
  account?: Account;
}