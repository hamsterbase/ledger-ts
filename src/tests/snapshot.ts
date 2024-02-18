import { expect } from "vitest";
import { Ledger } from "../core/ledger.js";
import { beanCount } from "../utils/beancount.js";
import * as path from "path";

export function assertSnapshot(ledger: Ledger, name: string) {
  const __dirname = new URL(".", import.meta.url).pathname;

  beanCount.serializationLedger(ledger);
  const snapshot = [
    `option "operating_currency" "${ledger.currencies[0].symbol}"\n`,
    beanCount.serializationLedger(ledger),
  ].join("\n");

  expect(snapshot).toMatchFileSnapshot(
    path.join(__dirname, `__snapshots__/${name}.bean`)
  );
}
