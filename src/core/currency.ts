import { ICurrency } from "./type.js";

export class Currency implements ICurrency {
  public symbol: string;
  public name?: string;
  public date: Date;
  constructor(option: ICurrency) {
    this.symbol = option.symbol;
    this.name = option.name;
    this.date = option.date;
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
}
