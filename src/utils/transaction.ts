import { Ledger } from "../core/ledger.js";
import { IPostings } from "../core/type.js";

export function transactionBuilder(ledger: Ledger) {
  function tr(date: string, narration: string, ...postings: IPostings[]): void;
  function tr(
    date: string,
    payee: string,
    narration: string,
    ...postings: IPostings[]
  ): void;
  function tr(date: string, payeeOrNarration: string, ...rest: any[]) {
    let narration: string;
    let postings: IPostings[];
    let payee: string | undefined = undefined;
    if (typeof rest[0] === "string") {
      payee = payeeOrNarration;
      narration = rest[0];
      postings = rest.slice(1);
    } else {
      narration = payeeOrNarration;
      postings = rest;
    }

    ledger.transaction({
      type: "transaction",
      date: new Date(date),
      flag: "*",
      narration,
      postings,
      payee,
    });
  }

  return {
    tr,
  };
}
