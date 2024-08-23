import { useNavigate } from 'react-router-dom';

export default function CategoryPage() {
  const navigate = useNavigate();

  return (
    <div>
      <button onClick={() => navigate('/pagination?page=1&parse=5')}>페이지네이션</button>
    </div>
  );
}
