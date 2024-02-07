import { Account } from "../core/account";
import { EAccountType, ICurrency } from "../core/type";

export interface AccountNodeConfig {
  open: string;
  close?: string;
  currency?: ICurrency;
}

export type AccountHierarchy = {
  [key: string]: AccountHierarchy | AccountNodeConfig;
};

export type BuiltAccountHierarchy<T> = {
  [P in keyof T]: T[P] extends AccountHierarchy
    ? BuiltAccountHierarchy<T[P]>
    : Account;
};

const specialKey = "_is_account_tree_option_";

export function createAccountNodeConfig(
  option: AccountNodeConfig
): AccountNodeConfig {
  return {
    ...option,
    //@ts-expect-error
    [specialKey]: true,
  };
}

function isAccountNodeConfig(
  option: AccountNodeConfig | AccountHierarchy
): option is AccountNodeConfig {
  return specialKey in option;
}

export function buildAccountHierarchy<T extends AccountHierarchy>(
  defaultCurrency: ICurrency,
  type: EAccountType,
  tree: T,
  prefix: string[] = []
): BuiltAccountHierarchy<T> {
  const res: Record<string, any> = {};
  Object.keys(tree).forEach((key) => {
    const option = tree[key];
    if (isAccountNodeConfig(option)) {
      res[key] = new Account({
        namespace: prefix.concat(key),
        type,
        defaultCurrency: option.currency ?? defaultCurrency,
        openDate: new Date(option.open),
        closeDate: option.close ? new Date(option.close) : undefined,
      });
    } else {
      res[key] = buildAccountHierarchy(
        defaultCurrency,
        type,
        option,
        prefix.concat(key)
      );
    }
  });
  return res as BuiltAccountHierarchy<T>;
}

export function flattenAccountHierarchy(
  accountTree: Record<string, any>
): Account[] {
  return Object.values(accountTree)
    .map((account) => {
      if (account instanceof Account) {
        return account;
      } else {
        return flattenAccountHierarchy(account);
      }
    })
    .flat();
}
