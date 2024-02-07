import { expect, it } from "vitest";
import { Currency } from "../core/currency";
import { EAccountType } from "../core/type";
import {
  buildAccountHierarchy,
  createAccountNodeConfig,
  flattenAccountHierarchy,
} from "./account-hierarchy";
import { beanCount } from "./beancount";

it("test accountTreeBuilder", () => {
  const USD = Currency.create("2017-01-01", "USD");
  const CNY = Currency.create("2017-01-01", "CNY");

  const assets = buildAccountHierarchy(CNY, EAccountType.Assets, {
    CN: {
      Bank: {
        BoC: {
          C1234: createAccountNodeConfig({ open: "2017-01-01" }),
        },
        Card: {
          USTC: createAccountNodeConfig({ open: "2017-01-01" }),
        },
      },
      Web: {
        AliPay: createAccountNodeConfig({ open: "2017-01-01" }),
        WeChatPay: createAccountNodeConfig({
          open: "2017-01-01",
          close: "2017-03-01",
        }),
      },
    },
    US: {
      Bank: {
        Card: {
          Visa: createAccountNodeConfig({ open: "2017-01-01", currency: USD }),
        },
      },
    },
  });

  expect(assets.CN.Bank.BoC.C1234.defaultCurrency.symbol).toBe("CNY");
  expect(assets.US.Bank.Card.Visa.defaultCurrency.symbol).toBe("USD");

  expect(beanCount.serializationAccounts(flattenAccountHierarchy(assets)))
    .toMatchInlineSnapshot(`
      "2017-01-01 open Assets:CN:Bank:BoC:C1234 CNY

      2017-01-01 open Assets:CN:Bank:Card:USTC CNY

      2017-01-01 open Assets:CN:Web:AliPay CNY

      2017-01-01 open Assets:CN:Web:WeChatPay CNY
      2017-01-01 close Assets:CN:Web:WeChatPay CNY

      2017-01-01 open Assets:US:Bank:Card:Visa USD"
    `);
});
