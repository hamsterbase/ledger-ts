import { Ledger } from "../core/ledger.js";
import { IPostings, ITransaction } from "../core/type.js";

type ITransactionProcess = (old: ITransaction) => ITransaction;

function buildTr(
  date: string,
  narration: string,
  ...postings: IPostings[]
): ITransaction;
function buildTr(
  date: string,
  payee: string,
  narration: string,
  ...postings: IPostings[]
): ITransaction;
function buildTr(
  date: string,
  payeeOrNarration: string,
  ...rest: any[]
): ITransaction {
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
  return {
    type: "transaction",
    date: new Date(date),
    flag: "*",
    narration,
    postings,
    payee,
  };
}

export function transactionBuilder(ledger: Ledger) {
  function tr(date: string, narration: string, ...postings: IPostings[]): void;
  function tr(
    date: string,
    payee: string,
    narration: string,
    ...postings: IPostings[]
  ): void;
  function tr(date: string, payeeOrNarration: string, ...rest: any[]) {
    ledger.transaction(buildTr(date, payeeOrNarration, ...rest));
  }

  function trFactory(
    processEr: ITransactionProcess | Array<ITransactionProcess>
  ) {
    return function tr(date: string, payeeOrNarration: string, ...rest: any[]) {
      let processErs: ITransactionProcess[] = [];
      if (Array.isArray(processEr)) {
        processErs = processEr;
      } else {
        processErs = [processEr];
      }
      let tr = buildTr(date, payeeOrNarration, ...rest);
      processErs.forEach((processEr) => {
        tr = processEr(tr);
      });
      ledger.transaction(tr);
    };
  }

  return {
    tr,
    trFactory,
  };
}

export function mergeTransactions(baseTransaction: Partial<ITransaction>) {
  return (additionalTransaction: Partial<ITransaction>): ITransaction => {
    return {
      type: "transaction",
      flag: "*",
      ...baseTransaction,
      ...additionalTransaction,
    } as ITransaction;
  };
}
