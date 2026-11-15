export type PaginationItem = number | "ellipsis";

export function getPaginationItems(
  currentPage: number,
  totalPages: number,
): PaginationItem[] {
  if (totalPages <= 0) return [];

  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const page = Math.min(Math.max(1, currentPage), totalPages);

  const pages = [...new Set([1, totalPages, page - 1, page, page + 1])].sort(
    (a, b) => a - b,
  );

  const items: PaginationItem[] = [];

  pages.forEach((pageNumber, index) => {
    if (index > 0 && pageNumber - pages[index - 1] > 1) {
      items.push("ellipsis");
    }

    items.push(pageNumber);
  });

  return items;
}
