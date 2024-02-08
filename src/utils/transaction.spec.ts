import { expect, it } from "vitest";
import { beanCount } from "./beancount.js";
import { createTestLedger } from "./create-test-ledger.js";
import { transactionBuilder } from "./transaction.js";

it("test price and cost", () => {
  const { currencies, ledger, assets } = createTestLedger();

  const { tr } = transactionBuilder(ledger);
  const jpAccount = assets.JP.Cash;
  const cnAccount = assets.CN.Bank.BoC.C1234;
  const JPY = currencies.JPY;

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
        Assets:JP:Cash 100 JPY
        Assets:CN:Bank:BoC:C1234 5 CNY @@ 100 JPY

      2021-01-01 * "first"
        Assets:JP:Cash 100 JPY
        Assets:CN:Bank:BoC:C1234 5 CNY @ 20 JPY

      2021-01-01 * "first"
        Assets:JP:Cash 100 JPY
        Assets:CN:Bank:BoC:C1234 5 CNY { 20 JPY }

      2021-01-01 * "first"
        Assets:JP:Cash 100 JPY
        Assets:CN:Bank:BoC:C1234 5 CNY { # 100 JPY }

      2021-01-01 * "first"
        Assets:JP:Cash 100 JPY
        Assets:CN:Bank:BoC:C1234 5 CNY { 20 JPY } @@ 100 JPY"
    `);
});
