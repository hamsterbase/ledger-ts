export interface ICurrency {
  date: Date;
  /**
   * @eg USD
   */
  symbol: string;

  name?: string;
}

export interface IAmount {
  value: number;
  currency: ICurrency;
}

export type IPostingsAs =
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
  as?: IPostingsAs;
  metadata?: Record<string, string>;
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
  metadata?: Record<string, string>;
}

export interface IPrice {
  type: "price";
  date: Date;
  currency: ICurrency;
  amount: IAmount;
  metadata?: Record<string, string>;
}

export const enum EAccountType {
  Assets = "Assets",
  Expenses = "Expenses",
  Income = "Income",
  Liabilities = "Liabilities",
  Equity = "Equity",
}

export interface ILedger {
  prices: IPrice[];
  transactions: ITransaction[];
  accounts: IAccount[];
  currencies: ICurrency[];
}
