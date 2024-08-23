import { usePagination } from '../hooks/usePagination';

interface PaginationProps {
  currentPageNumber: number;
  totalPageCount: number;
}

export default function Pagination({
  currentPageNumber = 1,
  totalPageCount = 10,
}: PaginationProps) {
  const {
    visiblePageNumbers,
    showPreviousEllipsis,
    showNextEllipsis,
    showPreviousPageButton,
    showNextPageButton,
  } = usePagination({ currentPageNumber, totalPageCount });

  console.log(
    visiblePageNumbers,
    showPreviousEllipsis,
    showNextEllipsis,
    showPreviousPageButton,
    showNextPageButton,
  );

  return (
    <></>
    // <Pagination>
    //   <PaginationContent>
    //     {showPreviousPageButton && (
    //       <PaginationItem>
    //         <PaginationPrevious
    //           href={`${path}?page=${currentPageNumber - 1}&parse=10`}
    //         />
    //       </PaginationItem>
    //     )}
    //     {showPreviousEllipsis && (
    //       <PaginationItem>
    //         <PaginationEllipsis />
    //       </PaginationItem>
    //     )}
    //     {visiblePageNumbers.map((visiblePageNumber) => (
    //       <PaginationItem
    //         key={visiblePageNumber}
    //         className={`${visiblePageNumber === currentPageNumber && 'rounded-lg border-2'}`}
    //       >
    //         <PaginationLink href={`${path}?page=${visiblePageNumber}&parse=10`}>
    //           {visiblePageNumber}
    //         </PaginationLink>
    //       </PaginationItem>
    //     ))}
    //     {showNextEllipsis && (
    //       <PaginationItem>
    //         <PaginationEllipsis />
    //       </PaginationItem>
    //     )}
    //     {showNextPageButton && (
    //       <PaginationItem>
    //         <PaginationNext href={`${path}?page=${currentPageNumber + 1}&parse=10`} />
    //       </PaginationItem>
    //     )}
    //   </PaginationContent>
    // </Pagination>
  );
}
