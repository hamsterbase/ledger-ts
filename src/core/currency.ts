import { IAmount, ICurrency, Metadata } from "./type.js";

export class Currency implements ICurrency {
  public symbol: string;
  public name?: string;
  public date: Date;
  public metadata?: Metadata | undefined;
  constructor(option: ICurrency) {
    this.symbol = option.symbol;
    this.name = option.name;
    this.date = option.date;
    this.metadata = option.metadata;
  }

  static create = (date: string, symbol: string) =>
    new Currency({
      date: new Date(date),
      symbol,
    });

  setName(value: string): ICurrency {
    return new Currency({
      date: this.date,
      symbol: this.symbol,
      name: value,
    });
  }

  amount(value: number): IAmount {
    return {
      value,
      currency: this,
    };
  }
}
