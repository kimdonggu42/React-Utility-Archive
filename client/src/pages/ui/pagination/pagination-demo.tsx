import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Pagination from '@/components/Pagination';
import { Posts } from '@/types/dummyData';
import { useMockServer } from '@/mocks/hooks/useMockServer';

export default function PaginationDemo() {
  const [posts, setPosts] = useState<Posts[]>([]);
  const [totalPageCount, setTotalPageCount] = useState<number>(0);

  const location = useLocation();
  const mockWorker = useMockServer();

  const queryParams = new URLSearchParams(location.search);
  const page = queryParams.get('page');
  const size = queryParams.get('size');

  useEffect(() => {
    if (!mockWorker) return;

    const getPosts = async () => {
      try {
        const res = await axios.get(`/posts?page=${page}&size=${size}`);
        setPosts(res.data.data);
        setTotalPageCount(res.data.totalPageCount);
      } catch (err) {
        console.error(err);
      }
    };
    getPosts();
  }, [page, size, mockWorker]);

  return (
    <div className='flex h-screen flex-col justify-center'>
      <div className='flex flex-col items-center gap-y-5'>
        <ul className='flex flex-col gap-y-2'>
          {posts.map((post) => (
            <li key={post.id} className='border border-black px-10'>
              {post.text}
            </li>
          ))}
        </ul>
        <Pagination
          currentPageNumber={Number(page)}
          totalPageCount={totalPageCount}
          size={Number(size) || 5}
        />
      </div>
    </div>
  );
}
