import { Link } from 'react-router-dom';
import { usePagination } from '@/feature/pagination/usePagination';

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
    <nav className='mx-auto flex w-full justify-center'>
      <ul className='flex flex-row items-center gap-1'>
        {showPreviousPageButton && (
          <li>
            <Link to={`/pagination?page=${currentPageNumber - 1}&parse=5`}>prev</Link>
          </li>
        )}
        {showPreviousEllipsis && <li>...</li>}
        {visiblePageNumbers.map((visiblePageNumber) => (
          <li
            key={visiblePageNumber}
            className={`${visiblePageNumber === currentPageNumber && 'rounded-lg border-2'}`}
          >
            <Link className='p-3' to={`/pagination?page=${visiblePageNumber}&parse=5`}>
              {visiblePageNumber}
            </Link>
          </li>
        ))}
        {showNextEllipsis && <li>...</li>}
        {showNextPageButton && (
          <li>
            <Link to={`/pagination?page=${currentPageNumber + 1}&parse=5`}>next</Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
