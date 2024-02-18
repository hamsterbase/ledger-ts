import { it } from "vitest";
import { createTestLedger } from "../tests/create-test-ledger.js";
import { assertSnapshot } from "../tests/snapshot.js";
import { prepaid } from "./prepaid.js";

it("test price and cost", () => {
  const { expenses, ledger, assets } = createTestLedger();

  ledger.transaction(
    ...prepaid({
      date: "2021-01-03",
      start: "2021-01-01",
      from: assets.CN.Bank.Card.USTC,
      to: expenses.XGP,
      amount: -100,
      prepaid: assets.Prepaid,
      parts: 12,
      payee: "xgp",
      narration: "xgp prepaid",
    })
  );

  assertSnapshot(ledger, "prepaid");
});
