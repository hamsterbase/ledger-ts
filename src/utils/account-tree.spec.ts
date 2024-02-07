import { expect, it } from "vitest";
import { EAccountType } from "../core/type";
import { Currency } from "./../core/currency";
import {
  accountTreeBuilder,
  accountTreeOption,
  accountTreeToList,
} from "./account-tree";
import { beanCount } from "./beancount";

it("test accountTreeBuilder", () => {
  const USD = Currency.create("2017-01-01", "USD");
  const CNY = Currency.create("2017-01-01", "CNY");

  const assets = accountTreeBuilder(CNY, EAccountType.Assets, {
    CN: {
      Bank: {
        BoC: {
          C1234: accountTreeOption({ open: "2017-01-01" }),
        },
        Card: {
          USTC: accountTreeOption({ open: "2017-01-01" }),
        },
      },
      Web: {
        AliPay: accountTreeOption({ open: "2017-01-01" }),
        WeChatPay: accountTreeOption({
          open: "2017-01-01",
          close: "2017-03-01",
        }),
      },
    },
    US: {
      Bank: {
        Card: {
          Visa: accountTreeOption({ open: "2017-01-01", currency: USD }),
        },
      },
    },
  });

  expect(assets.CN.Bank.BoC.C1234.defaultCurrency.symbol).toBe("CNY");
  expect(assets.US.Bank.Card.Visa.defaultCurrency.symbol).toBe("USD");

  expect(beanCount.serializationAccounts(accountTreeToList(assets)))
    .toMatchInlineSnapshot(`
      "2017-01-01 open Assets:CN:Bank:BoC:C1234 CNY

      2017-01-01 open Assets:CN:Bank:Card:USTC CNY

      2017-01-01 open Assets:CN:Web:AliPay CNY

      2017-01-01 open Assets:CN:Web:WeChatPay CNY
      2017-01-01 close Assets:CN:Web:WeChatPay CNY

      2017-01-01 open Assets:US:Bank:Card:Visa USD"
    `);
});
