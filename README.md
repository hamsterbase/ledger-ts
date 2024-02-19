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

You can view examples in the [example](./src/example) directory.

## License

MIT
