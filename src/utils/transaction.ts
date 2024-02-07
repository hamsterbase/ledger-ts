import { Ledger } from "../core/ledger";
import { IPostings } from "../core/type";

export function trBuilder(ledger: Ledger) {
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
    });
  }

  return {
    tr,
  };
}
