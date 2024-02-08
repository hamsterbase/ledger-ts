import { expect, it } from "vitest";
import { flattenAccountHierarchy } from "./account-hierarchy.js";
import { beanCount } from "./beancount.js";
import { createTestLedger } from "./create-test-ledger.js";

it("test accountTreeBuilder", () => {
  const { assets } = createTestLedger();

  expect(assets.CN.Bank.BoC.C1234.defaultCurrency.symbol).toBe("CNY");
  expect(assets.US.Bank.Card.Visa.defaultCurrency.symbol).toBe("USD");

  expect(beanCount.serializationAccounts(flattenAccountHierarchy(assets)))
    .toMatchInlineSnapshot(`
      "2017-01-01 open Assets:CN:Bank:BoC:C1234 CNY

      2017-01-01 open Assets:CN:Bank:Card:USTC CNY

      2017-01-01 open Assets:CN:Web:AliPay CNY

      2017-01-01 open Assets:CN:Web:WeChatPay CNY
      2017-01-01 close Assets:CN:Web:WeChatPay CNY

      2017-01-01 open Assets:JP:Cash JPY

      2017-01-01 open Assets:US:Bank:Card:Visa USD"
    `);
});
