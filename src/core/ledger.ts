import { IAccount, ICurrency, ILedger, IPrice, ITransaction } from "./type.js";

export class Ledger implements ILedger {
  public prices: IPrice[] = [];
  public transactions: ITransaction[] = [];
  constructor(public accounts: IAccount[], public currencies: ICurrency[]) {}

  transaction(transaction: ITransaction): void {
    this.transactions.push(transaction);
  }

  price(price: IPrice): void {
    this.prices.push(price);
  }
}
