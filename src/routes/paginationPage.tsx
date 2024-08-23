import axios from 'axios';
import { useLocation } from 'react-router-dom';

import { useState, useEffect } from 'react';

import Pagination from '@/components/common/Pagination';

interface Data {
  id: number;
  text: string;
}

export default function PaginationPage() {
  const [posts, setPosts] = useState<Data[]>([]);
  const [totalPageCount, setTotalPageCount] = useState<number>(0);

  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const page = queryParams.get('page');
  const parse = queryParams.get('parse');

  useEffect(() => {
    const getPosts = async () => {
      try {
        const res = await axios.get(`/posts?page=${page}&parse=${parse}`);
        setPosts(res.data.data);
        setTotalPageCount(res.data.totalPageCount);
      } catch (err) {
        console.error(err);
      }
    };
    getPosts();
  }, [page, parse]);

  return (
    <div>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>{post.text}</li>
        ))}
      </ul>
      <Pagination currentPageNumber={Number(page)} totalPageCount={totalPageCount} />
    </div>
  );
}
