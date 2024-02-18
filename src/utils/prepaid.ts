import dayjs from "dayjs";
import { Decimal } from "decimal.js";
import { Account, ITransaction } from "../index.js";
import { mergeTransactions } from "./transaction.js";

export interface PrepaidOption {
  date: string;
  start: string;
  parts: number;
  unit?: "month" | "week";
  amount: number;
  from: Account;
  to: Account;
  prepaid: Account;
  payee: string;
  narration: string;
}

export function prepaid(option: PrepaidOption) {
  let start = dayjs(option.start);
  let amountParts = splitAmount(option.amount, option.parts);
  const res: ITransaction[] = [
    mergeTransactions({
      date: new Date(option.date),
      payee: option.payee,
      narration: option.narration,
      postings: [
        option.from.posting(option.amount),
        option.prepaid.posting(-option.amount),
      ],
    })({}),
  ];

  for (let i = 0; i < option.parts; i++) {
    res.push(
      mergeTransactions({
        date: start.toDate(),
        payee: option.payee,
        narration: option.narration,
        postings: [
          option.prepaid.posting(amountParts[i]),
          option.to.posting(-amountParts[i]),
        ],
        metadata: {
          remain: option.parts - i - 1,
        },
      })({})
    );
    start = start.add(1, option.unit || "month");
  }
  return res;
}

function splitAmount(_total: number, parts: number) {
  const total = new Decimal(_total);
  const partValue = total.dividedBy(parts).toFixed(2);
  const lastValue = total
    .minus(new Decimal(partValue).mul(parts - 1))
    .toFixed(2);

  return new Array(parts - 1).fill(partValue).concat(lastValue);
}
