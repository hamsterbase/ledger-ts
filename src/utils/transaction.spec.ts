import { it } from "vitest";
import { assertSnapshot } from "../tests/snapshot.js";
import { createTestLedger } from "../tests/create-test-ledger.js";
import { transactionBuilder } from "./transaction.js";
import { padAccount } from "./pad-account.js";

it("test price and cost", () => {
  const { currencies, ledger, assets, expenses } = createTestLedger();
  const { tr, trFactory } = transactionBuilder(ledger);
  const jpAccount = assets.JP.Cash;
  const cnAccount = assets.CN.Bank.BoC.C1234;
  const JPY = currencies.JPY;

  tr(
    "2021-01-01",
    "first",
    jpAccount.posting(100),
    cnAccount.posting(-5).asCost(100, JPY)
  );

  tr(
    "2021-01-01",
    "first",
    jpAccount.posting(100),
    cnAccount.posting(-5).asPrice(20, JPY)
  );

  tr(
    "2021-01-01",
    "first",
    jpAccount.posting(100),
    cnAccount.posting(-5).heldPrice(20, JPY)
  );

  tr(
    "2021-01-01",
    "first",
    jpAccount.posting(-100),
    cnAccount.posting(5).heldCost(100, JPY)
  );

  tr(
    "2021-01-01",
    "first",
    jpAccount.posting(100),
    cnAccount.posting(-5).heldPrice(20, JPY).asCost(100, JPY)
  );

  const wechatTr = trFactory(padAccount(assets.CN.Web.WeChatPay));

  wechatTr("2021-01-01", "XGP", expenses.XGP.posting(100));

  assertSnapshot(ledger, "transaction");
});
