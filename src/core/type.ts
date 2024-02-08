export interface ICurrency {
  date: Date;
  /**
   * @eg USD
   */
  symbol: string;

  name?: string;

  metadata?: Metadata;
}

export interface IAmount {
  value: number;
  currency: ICurrency;
}

export type IPostingsPrice =
  | {
      type: "price";
      amount: IAmount;
    }
  | {
      type: "cost";
      amount: IAmount;
    };

export interface IPostings {
  account: IAccount;
  amount: IAmount;
  metadata?: Metadata;

  /**
   * price: 5 CNY { 20 JPY }
   * cost:  5 CNY { # 100 JPY }
   */
  held?: IPostingsPrice;
  /**
   * price: 5 CNY @ 20 JPY
   * cost:  5 CNY @@ 100 JPY
   */
  as?: IPostingsPrice;
}

export interface IAccount {
  namespace: string[];
  type: EAccountType;
  defaultCurrency: ICurrency;
  openDate: Date;
  closeDate?: Date;
}

export interface ITransaction {
  type: "transaction";
  date: Date;
  flag: string;
  payee?: string;
  narration: string;
  postings: IPostings[];
  metadata?: Metadata;
}

export interface IPrice {
  type: "price";
  date: Date;
  currency: ICurrency;
  amount: IAmount;
  metadata?: Metadata;
}

export const enum EAccountType {
  Assets = "Assets",
  Expenses = "Expenses",
  Income = "Income",
  Liabilities = "Liabilities",
  Equity = "Equity",
}

export interface IBalance {
  date: Date;
  amount: IAmount;
  account: IAccount;
}

export interface ILedger {
  prices: IPrice[];
  transactions: ITransaction[];
  accounts: IAccount[];
  currencies: ICurrency[];
  balances: IBalance[];
}

export type Metadata = Record<string, string | number>;
