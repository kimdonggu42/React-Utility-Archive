import { Link } from 'react-router-dom';

const categories = [
  {
    pageNum: 1,
    path: 'modal',
  },
  {
    pageNum: 2,
    path: 'infinitescroll',
  },
  {
    pageNum: 3,
    path: 'debounce',
  },
  {
    pageNum: 4,
    path: 'throttle',
  },
  {
    pageNum: 5,
    path: 'audiovisualizer',
  },
  {
    pageNum: 6,
    path: 'speechrecognition',
  },
] as const;

export default function App() {
  return (
    <nav className='flex h-screen flex-col items-center justify-center'>
      <ul className='flex flex-col items-center gap-y-5'>
        {categories.map((category) => (
          <li key={category.pageNum}>
            <Link to={`/${category.path}`}>
              <button className='inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium ring-offset-white hover:bg-slate-100 hover:text-slate-900'>
                {category.path}
              </button>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
