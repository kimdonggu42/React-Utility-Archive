import axios from 'axios';

import { useState, useRef, useEffect } from 'react';

import { useInfiniteScroll } from '@/infinite-scroll/useInfiniteScroll';
import { Posts } from '@/types/dummyData';

const infiniteScrollPageSize = 10;

export default function InfiniteScrollPage() {
  const [posts, setPosts] = useState<Posts[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalPageCount, setTotalPageCount] = useState<number>(0);

  const pageRef = useRef<number>(1);

  const targetRef = useInfiniteScroll(() => {
    getPosts();
  });

  useEffect(() => {
    const getTotalPageCount = async () => {
      try {
        const res = await axios.get(`/posts?page=1&size=${infiniteScrollPageSize}`);
        setTotalPageCount(res.data.totalDataCount);
      } catch (err) {
        console.error(err);
      }
    };
    getTotalPageCount();
  }, []);

  const getPosts = async () => {
    setLoading(true);
    try {
      if (posts.length < totalPageCount) {
        const res = await axios.get(
          `/posts?page=${pageRef.current}&size=${infiniteScrollPageSize}`,
        );
        setPosts((prevPosts) => [...prevPosts, ...res.data.data]);
        pageRef.current++;
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <ul className='max-w-[800px]'>
      {posts.map((post) => (
        <li className='h-[100px] border border-x-cyan-800' key={post.id}>
          {post.text}
        </li>
      ))}
      {loading ? <div>로딩 중</div> : <div ref={targetRef} />}
    </ul>
  );
}
