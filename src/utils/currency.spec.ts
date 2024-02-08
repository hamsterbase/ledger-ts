import { expect, it } from "vitest";
import { createCurrencies } from "./currency.js";
import dayjs from "dayjs";
import { beanCount } from "./beancount.js";

it("test createCurrencies", () => {
  const currencies = createCurrencies(
    {
      defaultDate: "2021-01-01",
    },
    [
      "CNY",
      "JPY",
      [
        "USD",
        {
          name: "Dollar",
          date: "2022-01-01",
          metadata: { a: 1, foo: "bar", name: "override" },
        },
      ],
    ] as const
  );

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
