import { IAccount, ICurrency, ILedger, IPrice, ITransaction } from "./type";

export class Ledger implements ILedger {
  public prices: IPrice[] = [];
  public transactions: ITransaction[] = [];
  constructor(public accounts: IAccount[], public currencies: ICurrency[]) {}

  transaction(transaction: ITransaction): void {
    this.transactions.push(transaction);
  }

  price(price): void {
    this.prices.push(price);
  }
}
