import { it } from "vitest";
import { Currency } from "../core/currency.js";
import { Account, EAccountType, Ledger } from "../index.js";
import { assertSnapshot } from "../tests/snapshot.js";

it("test serializationBalances", () => {
  const CNY = Currency.create("2017-01-01", "CNY");
  const USD = Currency.create("2017-01-01", "USD");
  const account = new Account({
    namespace: ["Cash"],
    type: EAccountType.Assets,
    currencies: [CNY],
    openDate: new Date("2017-01-01"),
  });
  const OpenBalance = new Account({
    namespace: ["OpenBalance"],
    type: EAccountType.Equity,
    currencies: [CNY],
    openDate: new Date("2017-01-01"),
  });
  const ledger = new Ledger([account, OpenBalance], [CNY]);
  ledger.balance(account.balance("2017-01-07", 10));
  ledger.balance(account.balance("2017-01-06", 10).padAccount(OpenBalance));
  assertSnapshot(ledger, "balance");
});
