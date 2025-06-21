import { useNavigate, useLocation } from 'react-router-dom';
import BookManager from '../components/BookManager';
import { useAuth } from '../context/AuthContext';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function Books() {
  const navigate = useNavigate();
  const { role } = useAuth();
  const query = useQuery();
  const search = query.get('q') || '';

  return (
    <div style={{ maxWidth: 1200, margin: '2rem auto',boxSizing: 'border-box' }}>
      {role === 'member' && (
        <>
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
        <br/>
        </>
      )}

      <h2 style={{display:'inline-block',borderBottom:'2px solid green', paddingBottom:'5px'}}>Available Books</h2>
      <BookManager
        canBorrow={role === 'member'}
        showForm={role === 'librarian' || role === 'admin'}
        canEdit={role === 'librarian' || role === 'admin'}
        canDelete={role === 'librarian' || role === 'admin'}
        search={search}
      />
    </div>
  );
}