import { it } from "vitest";
import { assertSnapshot } from "../tests/snapshot.js";
import { createTestLedger } from "../tests/create-test-ledger.js";
import { settle } from "./settle.js";

it("test price and cost", () => {
  const { currencies, ledger, assets } = createTestLedger();

  const jpAccount = assets.JP.Cash;
  const cnAccount = assets.CN.Bank.BoC.C1234;
  const JPY = currencies.JPY;

  ledger.transaction(
    ...settle(
      {
        type: "transaction",
        date: new Date("2021-01-01"),
        flag: "*",
        narration: "transform",
        postings: [
          jpAccount
            .posting(100)
            .meta("settle", "2021-01-02")
            .meta("foo", "bar"),
          cnAccount.posting(-5).asCost(100, JPY),
        ],
      },
      {
        account: assets.Transfer,
      }
    )
  );
  assertSnapshot(ledger, "settle");
});
