import { EAccountType, Ledger, utils } from "../index.js";

const { USD, CNY } = utils.createCurrencies({ defaultDate: "1970-10-01" }, [
  "USD",
  "CNY",
] as const);

const Assets = utils.buildAccountHierarchy(USD, EAccountType.Assets, {
  CN: {
    Cash: utils.createAccountNodeConfig({ open: "1970-01-01", currency: CNY }),
  },
  Cash: utils.createAccountNodeConfig({ open: "1970-01-01" }),
  UTrade: {
    Account: {
      AAPL: utils.createAccountNodeConfig({ open: "1970-01-01" }),
      EWJ: utils.createAccountNodeConfig({ open: "1970-01-01" }),
    },
  },
});

const Expenses = utils.buildAccountHierarchy(USD, EAccountType.Expenses, {
  Food: {
    Groceries: utils.createAccountNodeConfig({ open: "1970-01-01" }),
    Alcool: utils.createAccountNodeConfig({ open: "1970-01-01" }),
  },
});

const ledger = new Ledger(
  [
    ...utils.flattenAccountHierarchy(Assets),
    ...utils.flattenAccountHierarchy(Expenses),
  ],
  [USD, CNY]
);

const { tr } = utils.transactionBuilder(ledger);

tr(
  "1970-01-01",
  "Distribution of cash expenses",
  Assets.Cash.posting(-300),
  Expenses.Food.Alcool.posting(300)
);

console.log(utils.beanCount.serializationLedger(ledger));
