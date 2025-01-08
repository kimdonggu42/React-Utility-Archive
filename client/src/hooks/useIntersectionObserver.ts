// 참고: MDN IntersectionObserver(https://developer.mozilla.org/ko/docs/Web/API/IntersectionObserver)
import { useEffect, useRef } from 'react';

const options = {
  root: null,
  rootMargin: '0px',
  threshold: 1,
} as const;

export const useIntersectionObserver = (callback: () => void) => {
  const targetRef = useRef(null);

  useEffect(() => {
    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) callback();
      });
    };
    const observer = new IntersectionObserver(handleIntersect, options);
    const curTargetRef = targetRef.current;

    if (curTargetRef) observer.observe(curTargetRef);

    return () => {
      if (curTargetRef) observer.unobserve(curTargetRef);
    };
  }, [callback]);

  return targetRef;
};

// 사용법
// const topRef = useInfiniteScroll(() => {
//   getNextPageMessages();
// });
