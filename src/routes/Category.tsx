import axios from 'axios';

import { useEffect } from 'react';

export default function Category() {
  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get('/posts');
        console.log(res);
      } catch (err) {
        console.error(err);
      }
    };
    getData();
  }, []);

  return <></>;
}
