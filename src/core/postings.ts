import {
  IAccount,
  IAmount,
  ICurrency,
  IPostings,
  IPostingsAs,
} from "./type.js";

export class Postings implements IPostings {
  public account: IAccount;
  public amount: IAmount;
  public metadata?: Record<string, string>;
  public as?: IPostingsAs;
  constructor(option: IPostings, as?: IPostingsAs) {
    this.account = option.account;
    this.amount = option.amount;
    this.metadata = option.metadata;
    this.as = as;
  }

  asPrice(value: number, currency: ICurrency): IPostings {
    return new Postings(
      {
        account: this.account,
        amount: this.amount,
        metadata: this.metadata,
      },
      {
        type: "price",
        amount: {
          value,
          currency,
        },
      }
    );
  }

  asCost(value: number, currency: ICurrency): IPostings {
    return new Postings(
      {
        account: this.account,
        amount: this.amount,
        metadata: this.metadata,
      },
      {
        type: "cost",
        amount: {
          value,
          currency,
        },
      }
    );
  }

  meta(key: string, value: string) {
    return new Postings(
      {
        account: this.account,
        amount: this.amount,
        metadata: {
          ...this.metadata,
          [key]: value,
        },
      },
      this.as
    );
  }
}
