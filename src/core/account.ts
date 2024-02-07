import { Postings } from "./postings.js";
import {
  EAccountType,
  IAccount,
  IBalance,
  ICurrency,
  IPostings,
} from "./type.js";

export class Account implements IAccount {
  public namespace: string[];
  public type: EAccountType;
  public defaultCurrency: ICurrency;
  public openDate: Date;
  public closeDate?: Date;

  constructor(option: IAccount) {
    this.namespace = option.namespace;
    this.type = option.type;
    this.defaultCurrency = option.defaultCurrency;
    this.openDate = option.openDate;
    this.closeDate = option.closeDate;
  }

  posting(value: number, currency?: ICurrency): Postings {
    return new Postings({
      account: this,
      amount: {
        value,
        currency: currency ?? this.defaultCurrency,
      },
    });
  }

  balance(date: string, value: number, currency?: ICurrency): IBalance {
    return {
      date: new Date(date),
      account: this,
      amount: {
        value,
        currency: currency ?? this.defaultCurrency,
      },
    };
  }
}
