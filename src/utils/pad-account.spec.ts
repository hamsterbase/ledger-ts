import { expect, it } from "vitest";
import { createTestLedger } from "../tests/create-test-ledger.js";
import { beanCount } from "./beancount.js";
import { padAccount } from "./pad-account.js";

it("test padAccount", () => {
  const { expenses, ledger, assets } = createTestLedger();

  const patToAlipay = padAccount(assets.CN.Web.AliPay);

  expect(
    beanCount.serializationTransactions([
      patToAlipay({
        date: new Date("2021-10-01"),
        narration: "XGP",
        type: "transaction",
        flag: "*",
        postings: [expenses.XGP.posting(10)],
      }),
    ])
  ).toMatchInlineSnapshot(`
    "2021-10-01 * "XGP"
      Expenses:XGP                                                                    10 CNY
      Assets:CN:Web:AliPay                                                           -10 CNY"
  `);
});
