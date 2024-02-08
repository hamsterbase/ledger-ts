import { expect, it } from "vitest";
import { Account, Currency, EAccountType, Ledger } from "../index.js";
import { transactionBuilder } from "./transaction.js";
import { beanCount } from "./beancount.js";

it("add test for posting", () => {
  const CNY = Currency.create("2017-01-01", "CNY");
  const JPY = Currency.create("2017-01-01", "JPY");
  const cnAccount = new Account({
    namespace: ["Cash"],
    type: EAccountType.Assets,
    defaultCurrency: CNY,
    openDate: new Date("2017-01-01"),
  });
  const jpAccount = new Account({
    namespace: ["Bank"],
    type: EAccountType.Assets,
    defaultCurrency: JPY,
    openDate: new Date("2017-01-01"),
  });
  const ledger = new Ledger([cnAccount, jpAccount], [CNY]);

  const { tr } = transactionBuilder(ledger);

  tr(
    "2021-01-01",
    "first",
    jpAccount.posting(100),
    cnAccount.posting(5).asCost(100, JPY)
  );

  tr(
    "2021-01-01",
    "first",
    jpAccount.posting(100),
    cnAccount.posting(5).asPrice(20, JPY)
  );

  tr(
    "2021-01-01",
    "first",
    jpAccount.posting(100),
    cnAccount.posting(5).heldPrice(20, JPY)
  );

  tr(
    "2021-01-01",
    "first",
    jpAccount.posting(100),
    cnAccount.posting(5).heldCost(100, JPY)
  );

  tr(
    "2021-01-01",
    "first",
    jpAccount.posting(100),
    cnAccount.posting(5).heldPrice(20, JPY).asCost(100, JPY)
  );

  expect(beanCount.serializationTransactions(ledger.transactions))
    .toMatchInlineSnapshot(`
      "2021-01-01 * "first"
        Assets:Bank 100 JPY
        Assets:Cash 5 CNY @@ 100 JPY

      2021-01-01 * "first"
        Assets:Bank 100 JPY
        Assets:Cash 5 CNY @ 20 JPY

      2021-01-01 * "first"
        Assets:Bank 100 JPY
        Assets:Cash 5 CNY { 20 JPY }

      2021-01-01 * "first"
        Assets:Bank 100 JPY
        Assets:Cash 5 CNY { # 100 JPY }

      2021-01-01 * "first"
        Assets:Bank 100 JPY
        Assets:Cash 5 CNY { 20 JPY } @@ 100 JPY"
    `);
});
