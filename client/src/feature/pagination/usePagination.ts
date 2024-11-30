interface UsePaginationProps {
  currentPageNumber: number; // 현재 페이지 번호
  totalPageCount: number; // 전체 페이지 번호
  visiblePageCount: number; // 페이지네이션에서 한 번에 보여줄 페이지 개수
}

export const usePagination = ({
  currentPageNumber,
  totalPageCount,
  visiblePageCount = 5,
}: UsePaginationProps) => {
  const allpageNumbers = Array.from({ length: totalPageCount }, (_, i) => i + 1);
  const halfVisiblePageCount = Math.round(visiblePageCount / 2); // ex: visiblePageCount가 5일 경우 3

  // 현재 페이지(currentPageNumber)를 기준(중앙)으로 페이지네이션에서 한 번에 보여줄 페이지 번호들을 필터링
  const visiblePageNumbers = allpageNumbers.filter((pageNumber) =>
    currentPageNumber > halfVisiblePageCount
      ? Math.abs(pageNumber - currentPageNumber) < halfVisiblePageCount
      : pageNumber <= visiblePageCount,
  );
  const showPreviousEllipsis = currentPageNumber > halfVisiblePageCount;
  const showNextEllipsis = totalPageCount - currentPageNumber > halfVisiblePageCount - 1;
  const showPreviousPageButton = currentPageNumber > 1;
  const showNextPageButton = currentPageNumber < totalPageCount;

  return {
    visiblePageNumbers,
    showPreviousEllipsis,
    showNextEllipsis,
    showPreviousPageButton,
    showNextPageButton,
  };
};

// visiblePageNumbers 필터링 과정 예시(currentPageNumber(5) > halfVisiblePageCount(3) 조건일 경우)
// pageNumber = 1일 경우 결과값 4(Math.abs(1 - 5) = 4)는 3(halfVisiblePageCount)보다 크므로 1페이지는 제외됨
// pageNumber = 2일 경우 결과값 3(Math.abs(2 - 5) = 3)은 3(halfVisiblePageCount)과 같으므로 2페이지는 제외됨
// pageNumber = 3일 경우 결과값 2(Math.abs(3 - 5) = 2)는 3(halfVisiblePageCount)보다 작으므로 3페이지는 포함됨
// pageNumber = 4일 경우 결과값 1(Math.abs(4 - 5) = 1)은 3(halfVisiblePageCount)보다 작으므로 4페이지는 포함됨
// pageNumber = 5일 경우 결과값 0(Math.abs(5 - 5) = 0)은 3(halfVisiblePageCount)보다 작으므로 5페이지는 포함됨
// pageNumber = 6일 경우 결과값 1(Math.abs(6 - 5) = 1)은 3(halfVisiblePageCount)보다 작으므로 6페이지는 포함됨
// pageNumber = 7일 경우 결과값 2(Math.abs(7 - 5) = 2)는 3(halfVisiblePageCount)보다 작으므로 7페이지는 포함됨
// pageNumber = 8일 경우 결과값 3(Math.abs(8 - 5) = 3)은 3(halfVisiblePageCount)과 같으므로 8페이지는 제외됨
// pageNumber = 9일 경우 결과값 4(Math.abs(9 - 5) = 4)는 3(halfVisiblePageCount)보다 크므로 9페이지는 제외됨
// pageNumber = 10일 경우 결과값 5(Math.abs(10 - 5) = 5)는 3(halfVisiblePageCount)보다 크므로 10페이지는 제외됨

// visiblePageNumbers 필터링 과정 예시(currentPageNumber(2) < halfVisiblePageCount(3) 조건일 경우)
// pageNumber = 1일 경우 1은 5(visiblePageCount)보다 작으므로 1페이지는 포함됨
// pageNumber = 2일 경우 2는 5(visiblePageCount)보다 작으므로 2페이지는 포함됨
// pageNumber = 3일 경우 3은 5(visiblePageCount)보다 작으므로 3페이지는 포함됨
// pageNumber = 4일 경우 4는 5(visiblePageCount)보다 작으므로 4페이지는 포함됨
// pageNumber = 5일 경우 5는 5(visiblePageCount)와 같으므로 5페이지는 포함됨
// pageNumber = 6일 경우 6은 5(visiblePageCount)보다 크므로 6페이지는 제외됨
// pageNumber = 7일 경우 7은 5(visiblePageCount)보다 크므로 7페이지는 제외됨
// pageNumber = 8일 경우 8은 5(visiblePageCount)보다 크므로 8페이지는 제외됨
// pageNumber = 9일 경우 9는 5(visiblePageCount)보다 크므로 9페이지는 제외됨
// pageNumber = 10일 경우 10은 5(visiblePageCount)보다 크므로 10페이지는 제외됨
