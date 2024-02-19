import { expect, it } from "vitest";
import { compareString, mergeSortResult } from "./sort.js";

it("test mergeSortResult", () => {
  expect(mergeSortResult([0, 0, 1])).toBe(1);
});

it("test compareString", () => {
  expect(
    [
      undefined,
      "a",
      "b",
      "c",
      null,
      "aa",
      "",
      undefined,
      undefined,
      null,
      null,
      "01",
      "02",
    ]
      .map((o) => {
        return { key: o };
      })
      .sort((a, b) => {
        return compareString(a.key, b.key);
      })
      .map((o) => o.key)
  ).toEqual([
    null,
    null,
    null,
    undefined,
    undefined,
    undefined,
    "",
    "01",
    "02",
    "a",
    "aa",
    "b",
    "c",
  ]);
});
