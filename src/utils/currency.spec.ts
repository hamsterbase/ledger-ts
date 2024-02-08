import dayjs from "dayjs";
import { expect, it } from "vitest";
import { beanCount } from "./beancount.js";
import { createTestLedger } from "./create-test-ledger.js";

it("test createCurrencies", () => {
  const { currencies } = createTestLedger();
  expect(dayjs(currencies.USD.date).format("YYYY-MM-DD")).toBe("2022-01-01");
  expect(
    beanCount.serializationCurrencies(Object.values(currencies)).split("\n")
  ).toEqual([
    "2021-01-01 commodity CNY",
    "",
    "2021-01-01 commodity JPY",
    "",
    "2022-01-01 commodity USD",
    " a: 1",
    ' foo: "bar"',
    ' name: "override"',
  ]);
});
