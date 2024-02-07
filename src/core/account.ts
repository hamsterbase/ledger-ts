import { ICurrency, EAccountType, IAccount, IPostings } from "./type";

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

  posting(value: number, currency?: ICurrency): IPostings {
    return {
      account: this,
      amount: {
        value,
        currency: currency ?? this.defaultCurrency,
      },
    };
  }
}
