import {
  IAccount,
  IAmount,
  ICurrency,
  IPostings,
  IPostingsPrice,
  Metadata,
} from "./type.js";

export class Postings implements IPostings {
  public account: IAccount;
  public amount: IAmount;
  public metadata?: Metadata;
  public as?: IPostingsPrice;
  public held?: IPostingsPrice;

  constructor(option: IPostings) {
    this.account = option.account;
    this.amount = option.amount;
    this.metadata = option.metadata;
    this.as = option.as;
    this.held = option.held;
  }

  heldPrice(value: number, currency: ICurrency): Postings {
    return this.clone((old) => ({
      ...old,
      held: {
        type: "price",
        amount: {
          value,
          currency,
        },
      },
    }));
  }

  heldCost(value: number, currency: ICurrency): Postings {
    return this.clone((old) => ({
      ...old,
      held: {
        type: "cost",
        amount: {
          value,
          currency,
        },
      },
    }));
  }

  asPrice(value: number, currency: ICurrency): Postings {
    return this.clone((old) => ({
      ...old,
      as: {
        type: "price",
        amount: {
          value,
          currency,
        },
      },
    }));
  }

  asCost(value: number, currency: ICurrency): Postings {
    return this.clone((old) => ({
      ...old,
      as: {
        type: "cost",
        amount: {
          value,
          currency,
        },
      },
    }));
  }

  meta(key: string, value: string) {
    return this.clone((old) => ({
      ...old,
      metadata: {
        ...old.metadata,
        [key]: value,
      },
    }));
  }

  private clone(fn: (p: IPostings) => IPostings): Postings {
    return new Postings(
      fn({
        account: this.account,
        amount: this.amount,
        metadata: this.metadata,
        as: this.as,
        held: this.held,
      })
    );
  }
}
