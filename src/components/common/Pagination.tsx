import { usePagination } from '@/hooks/usePagination';
import {
  UIPagination,
  UIPaginationContent,
  UIPaginationEllipsis,
  UIPaginationItem,
  UIPaginationLink,
  UIPaginationNext,
  UIPaginationPrevious,
} from '@/components/ui/uiPagination';

interface PaginationProps {
  currentPageNumber: number;
  totalPageCount: number;
}

const visiblePageCount = 5;

export default function Pagination({ currentPageNumber, totalPageCount }: PaginationProps) {
  const {
    visiblePageNumbers,
    showPreviousEllipsis,
    showNextEllipsis,
    showPreviousPageButton,
    showNextPageButton,
  } = usePagination({ currentPageNumber, totalPageCount, visiblePageCount });

  return (
    <UIPagination>
      <UIPaginationContent>
        {showPreviousPageButton && (
          <UIPaginationItem>
            <UIPaginationPrevious href={`/pagination?page=${currentPageNumber - 1}&parse=5`} />
          </UIPaginationItem>
        )}
        {showPreviousEllipsis && (
          <UIPaginationItem>
            <UIPaginationEllipsis />
          </UIPaginationItem>
        )}
        {visiblePageNumbers.map((visiblePageNumber) => (
          <UIPaginationItem
            key={visiblePageNumber}
            className={`${visiblePageNumber === currentPageNumber && 'rounded-lg border-2'}`}
          >
            <UIPaginationLink href={`/pagination?page=${visiblePageNumber}&parse=5`}>
              {visiblePageNumber}
            </UIPaginationLink>
          </UIPaginationItem>
        ))}
        {showNextEllipsis && (
          <UIPaginationItem>
            <UIPaginationEllipsis />
          </UIPaginationItem>
        )}
        {showNextPageButton && (
          <UIPaginationItem>
            <UIPaginationNext href={`$/pagination?page=${currentPageNumber + 1}&parse=5`} />
          </UIPaginationItem>
        )}
      </UIPaginationContent>
    </UIPagination>
  );
}
