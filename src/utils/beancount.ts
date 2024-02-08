import {
  IAccount,
  IBalance,
  ICurrency,
  ILedger,
  IPostings,
  ITransaction,
  Metadata,
} from "../core/type.js";

class BeanCount {
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
        const metadata: Metadata = {};
        if (p.name) {
          metadata.name = p.name;
        }
        if (p.metadata) {
          Object.assign(metadata, p.metadata);
        }
        return this.mergeLines(0, [
          line,
          this.serializationMetadata(1, metadata),
        ]);
      })
      .join("\n\n");
  }

  private mergeLines(deep: number, lines: string[]): string {
    return lines
      .flat()
      .filter((p) => !!p.trim())
      .map((o) => this.indent(deep, o))
      .join("\n");
  }

  private serializationMetadata(deep: number, metadata?: Metadata) {
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

  serializationBalances(balances: IBalance[]): string {
    return balances
      .map((p) => {
        return `
${this.formateDate(p.date)} balance ${this.accountName(p.account)} ${
          p.amount.value
        } ${p.amount.currency.symbol}`.trim();
      })
      .join("\n");
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
    return `  ${this.accountName(o.account)} ${this.formatPostingsPrice(o)}`;
  })
  .join("\n")}`.trim();
        return res;
      })
      .join("\n\n");
  }

  private formatPostingsPrice(postings: IPostings) {
    const amount = postings.amount;
    if (!postings.as) {
      return `${amount.value} ${amount.currency.symbol}`;
    }
    const as = postings.as;
    switch (as.type) {
      case "price": {
        return `${amount.value} ${amount.currency.symbol} @ ${as.amount.value} ${as.amount.currency.symbol}`;
      }
      case "cost": {
        return `${amount.value} ${amount.currency.symbol} @@ ${as.amount.value} ${as.amount.currency.symbol}`;
      }
    }
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
