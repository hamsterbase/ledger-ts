import { EAccountType, Ledger } from "../index.js";
import {
  buildAccountHierarchy,
  createAccountNodeConfig,
  flattenAccountHierarchy,
} from "../utils/account-hierarchy.js";
import { createCurrencies } from "../utils/currency.js";
import { transactionBuilder } from "../utils/transaction.js";

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
          date: "2022-01-01",
          metadata: { foo: "bar", name: "Dollar" },
        },
      ],
    ] as const
  );

  const Equity = buildAccountHierarchy(currencies.CNY, EAccountType.Equity, {
    OpenBalance: createAccountNodeConfig({
      open: "2017-01-01",
      currency: [currencies.CNY, currencies.JPY],
    }),
  });

  const assets = buildAccountHierarchy(currencies.CNY, EAccountType.Assets, {
    Prepaid: createAccountNodeConfig({
      open: "2017-01-01",
    }),
    Transfer: createAccountNodeConfig({
      open: "2017-01-01",
      currency: [currencies.CNY, currencies.JPY],
    }),
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

  const expenses = buildAccountHierarchy(
    currencies.CNY,
    EAccountType.Expenses,
    {
      XGP: createAccountNodeConfig({
        open: "2017-01-01",
        currency: [currencies.CNY],
      }),
    }
  );

  const ledger = new Ledger(
    [
      flattenAccountHierarchy(expenses),
      flattenAccountHierarchy(assets),
      flattenAccountHierarchy(Equity),
    ].flat(),
    Object.values(currencies)
  );

  const { tr } = transactionBuilder(ledger);
  return {
    currencies,
    assets,
    expenses,
    ledger,
    tr,
  };
};
