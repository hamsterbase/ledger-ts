import { IAccount, ICurrency, ILedger, ITransaction } from "../core/type.js";

class BeanCount {
  serializationLedger(ledger: ILedger) {
    return `
${this.serializationCurrencies(ledger.currencies)}

${this.serializationAccounts(ledger.accounts)}

${this.serializationTransactions(ledger.transactions)}
    `.trim();
  }

  serializationCurrencies(currencies: ICurrency[]) {
    return currencies
      .map((p) => {
        let line = `${this.formateDate(p.date)} commodity ${p.symbol}`;
        if (p.name) {
          line += `\n  name: "${p.name}"`;
        }
        return line;
      })
      .join("\n\n");
  }

  serializationAccounts(accounts: IAccount[]): string {
    return accounts
      .map((p) => {
        let res = "";
        if (p.openDate) {
          res += `${this.formateDate(p.openDate)} open ${
            p.type
          }:${p.namespace.join(":")} ${p.defaultCurrency.symbol}`;
        }
        if (p.closeDate) {
          res += `\n${this.formateDate(p.openDate)} close ${
            p.type
          }:${p.namespace.join(":")} ${p.defaultCurrency.symbol}`;
        }
        return res;
      })
      .join("\n\n");
  }

  private accountName(account: IAccount): string {
    return `${account.type}:${account.namespace.join(":")}`;
  }

  serializationTransactions(transactions: ITransaction[]): string {
    return transactions
      .map((p) => {
        let payeeAndNarration;
        if (p.payee) {
          payeeAndNarration = `"${p.payee}" "${p.narration}"`;
        } else {
          payeeAndNarration = `"${p.narration}"`;
        }
        let res = `
${this.formateDate(p.date)} ${p.flag} ${payeeAndNarration}
${p.postings
  .map((o) => {
    return `  ${this.accountName(o.account)} ${o.amount.value} ${
      o.amount.currency.symbol
    }`;
  })
  .join("\n")}`.trim();
        return res;
      })
      .join("\n\n");
  }

  /**
   *
   * @returns YYYY-MM-DD
   */
  private formateDate(date: Date): string {
    return date.toISOString().split("T")[0];
  }
}

export const beanCount = new BeanCount();
