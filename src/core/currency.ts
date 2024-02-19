import { ICurrency, Metadata } from "./type.js";

export class Currency implements ICurrency {
  public symbol: string;
  public date: Date;
  public metadata?: Metadata | undefined;
  constructor(option: ICurrency) {
    this.symbol = option.symbol;
    this.date = option.date;
    this.metadata = option.metadata;
  }

  static create = (date: string, symbol: string) =>
    new Currency({
      date: new Date(date),
      symbol,
    });
}
