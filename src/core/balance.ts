import { IAccount, IAmount, IBalance } from "./type.js";

export class Balance implements IBalance {
  public date: Date;
  public amount: IAmount;
  public account: IAccount;
  public pad?: IAccount;
  constructor(options: IBalance) {
    this.date = options.date;
    this.amount = options.amount;
    this.account = options.account;
    this.pad = options.pad;
  }

  padAccount(account: IAccount) {
    return new Balance({
      date: this.date,
      amount: this.amount,
      account: this.account,
      pad: account,
    });
  }
}
