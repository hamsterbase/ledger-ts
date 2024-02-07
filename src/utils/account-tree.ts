import { Account } from "../core/account";
import { EAccountType, ICurrency } from "../core/type";

export interface AccountTreeOption {
  open: string;
  close?: string;
  currency?: ICurrency;
}

export type AccountTree = {
  [key: string]: AccountTree | AccountTreeOption;
};

export type AccountTreeBuilderRes<T> = {
  [P in keyof T]: T[P] extends AccountTree
    ? AccountTreeBuilderRes<T[P]>
    : Account;
};

const specialKey = "_is_account_tree_option_";

export function accountTreeOption(
  option: AccountTreeOption
): AccountTreeOption {
  return {
    ...option,
    //@ts-expect-error
    [specialKey]: true,
  };
}

function isAccountTreeOption(
  option: AccountTreeOption | AccountTree
): option is AccountTreeOption {
  return specialKey in option;
}

export function accountTreeBuilder<T extends AccountTree>(
  defaultCurrency: ICurrency,
  type: EAccountType,
  tree: T,
  prefix: string[] = []
): AccountTreeBuilderRes<T> {
  const res: Record<string, any> = {};
  Object.keys(tree).forEach((key) => {
    const option = tree[key];
    if (isAccountTreeOption(option)) {
      res[key] = new Account({
        namespace: prefix.concat(key),
        type,
        defaultCurrency: option.currency ?? defaultCurrency,
        openDate: new Date(option.open),
        closeDate: option.close ? new Date(option.close) : undefined,
      });
    } else {
      res[key] = accountTreeBuilder(
        defaultCurrency,
        type,
        option,
        prefix.concat(key)
      );
    }
  });
  return res as AccountTreeBuilderRes<T>;
}

export function accountTreeToList(accountTree: Record<string, any>): Account[] {
  return Object.values(accountTree)
    .map((account) => {
      if (account instanceof Account) {
        return account;
      } else {
        return accountTreeToList(account);
      }
    })
    .flat();
}
