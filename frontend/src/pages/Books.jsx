import { useNavigate } from 'react-router-dom';
import BookManager from '../components/BookManager';
import { useAuth } from '../context/AuthContext';



export default function Books() {
  const navigate = useNavigate();
  const { role } = useAuth();
  return (
    <div style={{ maxWidth: 1200, margin: '2rem auto' }}>
      {role === 'member' && (
        <button
          style={{
            marginBottom: 20,
            padding: '8px 16px',
            background: '#388e3c',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer'
          }}
          onClick={() => navigate('/borrowings')}
        >
          View My Borrowing History
        </button>
      )}
      <h2>Available Books</h2>
      <BookManager
        canBorrow={true}
        showForm={false}
        canEdit={false}
        canDelete={false}
      />
    </div>
  );
}