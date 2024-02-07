import { Currency, EAccountType, Ledger, utils } from "../src/index";

const USD = Currency.create("1970-01-01", "USD");

const Assets = utils.buildAccountHierarchy(USD, EAccountType.Assets, {
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
  [USD]
);

const { tr } = utils.transactionBuilder(ledger);

tr(
  "1970-01-01",
  "Distribution of cash expenses",
  Assets.Cash.posting(-300),
  Expenses.Food.Alcool.posting(300)
);

console.log(utils.beanCount.serializationLedger(ledger));
