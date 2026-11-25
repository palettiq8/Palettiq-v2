import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { getPaginationItems } from "@/lib/utils/palette-pagination";

interface PalettePaginationProps {
  page: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
}

export function PalettePagination({
  page,
  totalPages,
  pageSize,
  totalCount,
  onPageChange,
}: PalettePaginationProps) {
  if (totalPages <= 1 || totalCount <= 0) return null;

  const currentPage = Math.min(Math.max(1, page), totalPages);
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalCount);

  return (
    <div className="mt-8 flex flex-col items-center gap-3">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              aria-disabled={currentPage === 1}
              tabIndex={currentPage === 1 ? -1 : 0}
              className={
                currentPage === 1
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
              onClick={(event) => {
                event.preventDefault();

                if (currentPage > 1) {
                  onPageChange(currentPage - 1);
                }
              }}
            />
          </PaginationItem>

          {getPaginationItems(currentPage, totalPages).map((item, index) => (
            <PaginationItem key={`${item}-${index}`}>
              {item === "ellipsis" ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  href="#"
                  isActive={currentPage === item}
                  aria-current={currentPage === item ? "page" : undefined}
                  onClick={(event) => {
                    event.preventDefault();

                    if (currentPage !== item) {
                      onPageChange(item);
                    }
                  }}
                >
                  {item}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              href="#"
              aria-disabled={currentPage === totalPages}
              tabIndex={currentPage === totalPages ? -1 : 0}
              className={
                currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
              onClick={(event) => {
                event.preventDefault();

                if (currentPage < totalPages) {
                  onPageChange(currentPage + 1);
                }
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      <p className="text-xs text-muted-foreground" aria-live="polite">
        Showing {startItem}–{endItem} of {totalCount} palettes
      </p>
    </div>
  );
}
