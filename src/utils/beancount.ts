import dayjs from "dayjs";
import {
  IAccount,
  IBalance,
  ICurrency,
  ILedger,
  IPostings,
  ITransaction,
  Metadata,
} from "../core/type.js";
import { compareDate, compareString, mergeSortResult } from "./sort.js";

class BeanCount {
  private accountPad = 70;
  private currencyPad = 15;

  private indent(deep: number, str: string) {
    return new Array(deep).fill(" ").join("") + str;
  }

  serializationLedger(ledger: ILedger) {
    return `
${this.serializationCurrencies(ledger.currencies)}

${this.serializationAccounts(ledger.accounts)}

${this.serializationTransactions(ledger.transactions)}

${this.serializationBalances(ledger.balances)}
    `.trim();
  }

  serializationCurrencies(currencies: ICurrency[]) {
    return currencies
      .map((p) => {
        let line = `${this.formateDate(p.date)} commodity ${p.symbol}`;
        return this.mergeLines(0, [
          line,
          this.serializationMetadata(1, p.metadata),
        ]);
      })
      .join("\n\n");
  }

  private mergeLines(deep: number, lines: string[] | Array<string[]>): string {
    return lines
      .flat()
      .filter((p) => !!p.trim())
      .map((o) => this.indent(deep, o))
      .join("\n");
  }

  private serializationMetadata(deep: number, metadata?: Metadata | null) {
    if (!metadata) {
      return "";
    }
    return this.mergeLines(
      deep,
      Object.keys(metadata)
        .sort()
        .map((key) => {
          return `${key}: ${JSON.stringify(metadata[key])}`;
        })
    );
  }

  serializationAccounts(accounts: IAccount[]): string {
    return accounts
      .sort((a, b) => {
        return mergeSortResult([
          compareDate(a.openDate, b.openDate),
          compareString(this.accountName(a), this.accountName(b)),
        ]);
      })
      .map((p) => {
        let res = "";
        if (p.openDate) {
          res += `${this.formateDate(p.openDate)} open ${this.accountName(
            p,
            this.accountPad - (this.currencyPad - 13)
          )} ${p.currencies.map((o) => o.symbol).join(",")}`;
        }
        if (p.closeDate) {
          res += `\n${this.formateDate(p.openDate)} close ${this.accountName(
            p
          )}`;
        }
        return res;
      })
      .join("\n\n");
  }

  serializationBalances(balances: IBalance[]): string {
    return balances
      .sort((a, b) => {
        return mergeSortResult([
          compareDate(a.date, b.date),
          compareString(
            this.accountName(a.account),
            this.accountName(b.account)
          ),
        ]);
      })
      .map((p) => {
        let pad = "";
        if (p.pad) {
          const lastDay = dayjs(p.date).subtract(1, "day").toDate();
          pad = `${this.formateDate(lastDay)} pad     ${this.accountName(
            p.account,
            0
          )} ${this.accountName(p.pad, 0)}`;
        }
        return `
${pad}
${this.formateDate(p.date)} balance ${this.accountName(p.account)} ${
          p.amount.value
        } ${p.amount.currency.symbol}`.trim();
      })
      .join("\n\n");
  }

  private accountName(account: IAccount, pad?: number): string {
    return `${account.type}:${account.namespace.join(":")}`.padEnd(
      pad ?? this.accountPad
    );
  }

  serializationTransactions(transactions: ITransaction[]): string {
    return transactions
      .sort((a, b) => {
        return mergeSortResult([
          compareDate(a.date, b.date),
          compareString(a.payee, b.payee),
          compareString(a.narration, b.narration),
        ]);
      })
      .map((p) => {
        let payeeAndNarration;
        if (p.payee) {
          payeeAndNarration = `"${p.payee}" "${p.narration}"`;
        } else {
          payeeAndNarration = `"${p.narration}"`;
        }
        const res = this.mergeLines(0, [
          `${this.formateDate(p.date)} ${p.flag} ${payeeAndNarration}`,
          this.serializationMetadata(2, p.metadata),
          this.mergeLines(
            2,
            p.postings
              .sort((a, b) => {
                return b.amount.value - a.amount.value;
              })
              .map((o) => {
                return [
                  `${this.accountName(o.account)} ${this.formatPostingsPrice(
                    o
                  )}`,
                  this.serializationMetadata(2, o.metadata),
                ];
              })
          ),
        ]);

        return res;
      })
      .join("\n\n");
  }

  private formatPostingsPrice(postings: IPostings) {
    const amount = postings.amount;

    const price = [
      `${amount.value} ${amount.currency.symbol}`.padStart(this.currencyPad),
    ];

    if (postings.held) {
      const held = postings.held;
      switch (held.type) {
        case "price": {
          price.push(`{ ${held.amount.value} ${held.amount.currency.symbol} }`);
          break;
        }
        case "cost": {
          price.push(
            `{ # ${held.amount.value} ${held.amount.currency.symbol} }`
          );
          break;
        }
      }
    }

    if (postings.as) {
      const as = postings.as;
      switch (as.type) {
        case "price": {
          price.push(`@ ${as.amount.value} ${as.amount.currency.symbol}`);
          break;
        }
        case "cost": {
          price.push(`@@ ${as.amount.value} ${as.amount.currency.symbol}`);
          break;
        }
      }
    }
    return price.join(" ");
  }

  /**
   *
   * @returns YYYY-MM-DD
   */
  private formateDate(date: Date): string {
    return dayjs(date).format("YYYY-MM-DD");
  }
}

export const beanCount = new BeanCount();
