export type PageToken = number | "gap";

export function buildPageNumbers(page: number, total: number): PageToken[] {
  if (total <= 9) return Array.from({ length: total }, (_, i) => i + 1);
  const set = new Set<number>([1, total, page]);
  if (page > 1) set.add(page - 1);
  if (page < total) set.add(page + 1);
  if (page - 2 > 1) set.add(page - 2);
  if (page + 2 < total) set.add(page + 2);
  const sorted = [...set].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
  const result: PageToken[] = [];
  sorted.forEach((n, i) => {
    if (i > 0 && n - (sorted[i - 1] as number) > 1) result.push("gap");
    result.push(n);
  });
  return result;
}

