import { Decimal } from "decimal.js";
import { Account, ITransaction } from "../index.js";

export function padAccount(account: Account) {
  return (old: ITransaction): ITransaction => {
    let init = new Decimal(0);
    old.postings.forEach((posting) => {
      init = init.add(posting.amount.value);
    });
    const newPosting = [
      ...old.postings,
      account.posting(new Decimal(0).minus(init).toNumber()),
    ];
    return {
      ...old,
      postings: newPosting,
    };
  };
}
