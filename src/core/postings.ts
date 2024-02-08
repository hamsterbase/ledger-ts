import {
  IAccount,
  IAmount,
  ICurrency,
  IPostings,
  IPostingsAs,
  Metadata,
} from "./type.js";

export class Postings implements IPostings {
  public account: IAccount;
  public amount: IAmount;
  public metadata?: Metadata;
  public as?: IPostingsAs;
  constructor(option: IPostings) {
    this.account = option.account;
    this.amount = option.amount;
    this.metadata = option.metadata;
    this.as = option.as;
  }

  asPrice(value: number, currency: ICurrency): IPostings {
    return new Postings({
      account: this.account,
      amount: this.amount,
      metadata: this.metadata,
      as: {
        type: "price",
        amount: {
          value,
          currency,
        },
      },
    });
  }

  asCost(value: number, currency: ICurrency): IPostings {
    return new Postings({
      account: this.account,
      amount: this.amount,
      metadata: this.metadata,
      as: {
        type: "cost",
        amount: {
          value,
          currency,
        },
      },
    });
  }

  meta(key: string, value: string) {
    return new Postings({
      account: this.account,
      amount: this.amount,
      metadata: {
        ...this.metadata,
        [key]: value,
      },
      as: this.as,
    });
  }
}
