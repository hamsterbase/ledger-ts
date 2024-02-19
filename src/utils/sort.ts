export function mergeSortResult(list: number[]) {
  for (const iterator of list) {
    if (iterator !== 0) {
      return iterator;
    }
  }
  return 0;
}

export function compareString(a?: string | null, b?: string | null): number {
  if (typeof a !== "string" && typeof b !== "string") {
    return String(a).localeCompare(String(b));
  }

  if (typeof a !== "string") {
    return -1;
  }
  if (typeof b !== "string") {
    return 1;
  }
  return a.localeCompare(b);
}
