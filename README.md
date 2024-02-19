# ledger-ts

ledger-ts is a double-entry accounting tool written in TypeScript. Its goal is to use TypeScript for writing personal financial records and then generate formats required by other accounting tools.

Currently, it only supports the beancount format. Therefore, it is recommended to learn beancount's syntax and rules before using it.

## Background

When using beancount for accounting on a daily basis, I encountered some troubles. For instance, code completion is weak and bill reuse completely depends on copy and pasting.

So, I created ledger-ts. To put it in an analogy, ledger-ts is a more advanced accounting language that can be "compiled" (executed) into beancount, which serves as the underlying "assembly language."

## Advantages

- Allows the use of any IDE to write records enjoying strong code completion.
- Supports using the powerful TypeScript type system to check the correctness of records.
- Freely use TypeScript to write auxiliary functions to generate records.
- Can output records to formats required by other accounting tools.

## Installation

```bash
npm install ledger-ts
```

## Usage

```ts
import { EAccountType, Ledger, utils } from "@hamsterbase/ledger-ts";

// setup currencies
const currencies = utils.createCurrencies(
  {
    defaultDate: "2021-01-01",
  },
  ["USD", "IBM"] as const
);

// setup accounts
const assets = utils.buildAccountHierarchy(
  currencies.USD,
  EAccountType.Assets,
  {
    US: {
      ETrade: {
        Cash: utils.createAccountNodeConfig({
          open: "2017-01-01",
        }),
        IBM: utils.createAccountNodeConfig({
          open: "2017-01-01",
          currency: currencies.IBM,
        }),
      },
    },
  }
);

// create a ledger and add accounts, currencies
const ledger = new Ledger(
  [utils.flattenAccountHierarchy(assets)].flat(),
  Object.values(currencies)
);
const { tr } = utils.transactionBuilder(ledger);

// add a transaction
tr(
  "2024-02-16",
  "Buying some IBM",
  assets.US.ETrade.IBM.posting(100).heldPrice(160, currencies.USD),
  assets.US.ETrade.Cash.posting(-16000)
);

// output the ledger
console.log(utils.beanCount.serializationLedger(ledger));
```

```
2021-01-01 commodity USD

2021-01-01 commodity IBM

2017-01-01 open Assets:US:ETrade:Cash USD

2017-01-01 open Assets:US:ETrade:IBM IBM

2024-02-16 * "Buying some IBM"
  Assets:US:ETrade:IBM 100 IBM { 160 USD }
  Assets:US:ETrade:Cash -16000 USD
```

## License

MIT
