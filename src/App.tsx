import axios from 'axios';

import { useEffect } from 'react';

import { useThrottle } from './hooks/useThrottle';

export default function App() {
  const throttle = useThrottle();

  const test = () => {
    throttle(() => console.log('실행'), 2000);
  };

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

  return <button onClick={test}>클릭</button>;
}
