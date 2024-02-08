import { EAccountType, Ledger } from "../index.js";
import {
  buildAccountHierarchy,
  createAccountNodeConfig,
  flattenAccountHierarchy,
} from "./account-hierarchy.js";
import { createCurrencies } from "./currency.js";

export const createTestLedger = () => {
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

  const assets = buildAccountHierarchy(currencies.CNY, EAccountType.Assets, {
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
    JP: {
      Cash: createAccountNodeConfig({
        open: "2017-01-01",
        currency: currencies.JPY,
      }),
    },
    US: {
      Bank: {
        Card: {
          Visa: createAccountNodeConfig({
            open: "2017-01-01",
            currency: currencies.USD,
          }),
        },
      },
    },
  });

  const ledger = new Ledger(
    flattenAccountHierarchy(assets),
    Object.values(currencies)
  );

  return {
    currencies,
    assets,
    ledger,
  };
};
