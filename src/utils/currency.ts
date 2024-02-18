import { Currency, Metadata } from "../index.js";

type ToObject<T, V> = T extends readonly [infer Key, other: unknown]
  ? Key extends PropertyKey
    ? {
        [P in Key]: V;
      }
    : never
  : never;

type StringToObject<T extends string, V> = {
  [P in T]: V;
};

type ToObjectArray<T, V> = {
  [I in keyof T]: T[I] extends string
    ? StringToObject<T[I], V>
    : ToObject<T[I], V>;
};

type ConvertArrayToObject<T> = {
  //@ts-expect-error
  [K in T[number] as keyof K]: K[keyof K];
};

interface CurrencyOption {
  date?: string;
  metadata?: Metadata;
}

export type CurrencyConfig = Array<string | [string, CurrencyOption]>;

interface CreateCurrenciesOptions {
  defaultDate: string;
}

export function createCurrencies<T extends CurrencyConfig>(
  option: CreateCurrenciesOptions,
  config: T
): ConvertArrayToObject<ToObjectArray<T, Currency>> {
  const result: Record<string, Currency> = {};
  for (const currencyConfig of config) {
    if (typeof currencyConfig === "string") {
      result[currencyConfig] = new Currency({
        date: new Date(option.defaultDate),
        symbol: currencyConfig,
      });
    } else {
      const [symbol, currencyOption] = currencyConfig;

      result[symbol] = new Currency({
        date: currencyOption.date
          ? new Date(currencyOption.date)
          : new Date(option.defaultDate),
        symbol,
        metadata: currencyOption.metadata,
      });
    }
  }
  //@ts-ignore
  return result;
}
