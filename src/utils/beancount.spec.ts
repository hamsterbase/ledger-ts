import { expect, it } from "vitest";
import { beanCount } from "./beancount.js";
import { Currency } from "../core/currency.js";

it("test serializationCurrencies", () => {
  const USD = Currency.create("2017-01-01", "USD").setName("Dollar");
  const CNY = Currency.create("2017-01-01", "CNY");

  expect(beanCount.serializationCurrencies([USD, CNY])).toMatchInlineSnapshot(`
    "2017-01-01 commodity USD
      name: "Dollar"

    2017-01-01 commodity CNY"
  `);
});
