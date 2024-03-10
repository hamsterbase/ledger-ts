import dayjs from "dayjs";
import { Ledger } from "../core/ledger.js";
import { IPostings, ITransaction, Metadata } from "../core/type.js";

export type ITransactionProcess = (old: ITransaction) => ITransaction;

export interface TransactionFn<T> {
  (date: string, narration: string, ...postings: IPostings[]): T;
  (date: string, payee: string, narration: string, ...postings: IPostings[]): T;
}

const buildTr: TransactionFn<ITransaction> = (
  date: string,
  payeeOrNarration: string,
  ...rest: any[]
): ITransaction => {
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

  const onlyDate = date === dayjs(new Date(date)).format("YYYY-MM-DD");

  const metadata: Metadata = {};
  if (!onlyDate) {
    metadata["date"] = date;
  }
  return {
    type: "transaction",
    date: new Date(date),
    flag: "*",
    narration,
    postings,
    payee,
    metadata,
  };
};

export function transactionBuilder(ledger: Ledger) {
  const tr: TransactionFn<void> = (
    date: string,
    payeeOrNarration: string,
    ...rest: any[]
  ) => {
    ledger.transaction(buildTr(date, payeeOrNarration, ...rest));
  };

  function trFactory(
    processEr: ITransactionProcess | Array<ITransactionProcess>
  ): TransactionFn<void> {
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
