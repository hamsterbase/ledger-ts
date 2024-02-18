import { Postings } from "./postings.js";
import { EAccountType, IAccount, IBalance, ICurrency } from "./type.js";

export class Account implements IAccount {
  public namespace: string[];
  public type: EAccountType;
  public openDate: Date;
  public closeDate?: Date;
  public currencies: ICurrency[];

  constructor(option: IAccount) {
    if (option.currencies.length < 1) {
      throw new Error("currencies is empty");
    }
    this.namespace = option.namespace;
    this.type = option.type;
    this.openDate = option.openDate;
    this.closeDate = option.closeDate;
    this.currencies = option.currencies;
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

  public get defaultCurrency(): ICurrency {
    return this.currencies[0]!;
  }
}
