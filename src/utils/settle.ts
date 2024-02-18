import { Account, IPostings, ITransaction } from "../index.js";

export const SettleMetadataKey = "settle";

export function settle(tr: ITransaction, option: { account: Account }) {
  const res: ITransaction[] = [];

  const newPostings: IPostings[] = tr.postings.map((o) => {
    if (o.metadata?.[SettleMetadataKey]) {
      res.push({
        type: "transaction",
        date: new Date(o.metadata[SettleMetadataKey]),
        flag: tr.flag,
        payee: tr.payee,
        narration: `Settle ${tr.narration}`,
        postings: [
          {
            ...negative(removeMetadataKeys(o, [SettleMetadataKey])),
            account: option.account,
            metadata: null,
          },
          removeMetadataKeys(o, [SettleMetadataKey]),
        ],
      });

      return removeMetadataKeys(
        {
          ...o,
          account: option.account,
          metadata: null,
        },
        [SettleMetadataKey]
      );
    }
    return o;
  });

  res.unshift({
    ...tr,
    postings: newPostings,
  });

  return res;
}

function removeMetadataKeys(postings: IPostings, keys: string[]): IPostings {
  const metadata = { ...postings.metadata };
  keys.forEach((key) => {
    delete metadata[key];
  });
  return {
    ...postings,
    metadata,
  };
}

function negative(postings: IPostings): IPostings {
  return {
    ...postings,
    amount: {
      ...postings.amount,
      value: -postings.amount.value,
    },
  };
}
