import { expect, it } from "vitest";
import { Currency } from "../core/currency.js";
import { Account, EAccountType, Ledger } from "../index.js";
import { beanCount } from "./beancount.js";

it("test serializationBalances", () => {
  const CNY = Currency.create("2017-01-01", "CNY");
  const USD = Currency.create("2017-01-01", "USD");
  const account = new Account({
    namespace: ["Cash"],
    type: EAccountType.Assets,
    currencies: [CNY],
    openDate: new Date("2017-01-01"),
  });
  const ledger = new Ledger([account], [CNY]);
  ledger.balance({
    date: new Date("2017-01-02"),
    account,
    amount: CNY.amount(100),
  });
  ledger.balance({
    date: new Date("2017-01-05"),
    account,
    amount: USD.amount(100),
  });

  ledger.balance(account.balance("2017-01-06", 10));

  expect(beanCount.serializationBalances(ledger.balances))
    .toMatchInlineSnapshot(`
      "2017-01-02 balance Assets:Cash 100 CNY
      2017-01-05 balance Assets:Cash 100 USD
      2017-01-06 balance Assets:Cash 10 CNY"
    `);
});
