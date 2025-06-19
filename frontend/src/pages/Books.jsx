// src/pages/Books.jsx
import { useState, useEffect } from 'react';
import { fetchBooks, borrowBook } from '../api';
import BookCardGrid from '../components/BookCardGrid';
import { useNavigate } from 'react-router-dom';

export default function Books() {
  const [books, setBooks] = useState([]);
  const [q, setQ] = useState('');
  const [msg, setMsg] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [prefetched, setPrefetched] = useState(null);
  const perPage = 10;
  const navigate = useNavigate();
  const role = localStorage.getItem('role');

  const loadBooks = () => {
    fetchBooks(q, page, perPage).then(data => {
      setBooks(Array.isArray(data.books) ? data.books : []);
      setTotalPages(data.total_pages || 1);

      // Prefetch next page if it exists
      if (page < (data.total_pages || 1)) {
        fetchBooks(q, page + 1, perPage).then(nextData => {
          setPrefetched(Array.isArray(nextData.books) ? nextData.books : []);
        });
      } else {
        setPrefetched(null);
      }
    });
  };

  useEffect(() => {
    loadBooks();
    // eslint-disable-next-line
  }, [q, page]);

  const handleBorrow = async (book_id) => {
    try {
      await borrowBook(book_id);
      setMsg('Book borrowed successfully!');
      loadBooks();
    } catch (err) {
      setMsg('Error borrowing book');
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      if (newPage === page + 1 && prefetched) {
        setBooks(prefetched);
        setPage(newPage);
        // Prefetch the next-next page
        fetchBooks(q, newPage + 1, perPage).then(nextData => {
          setPrefetched(nextData.books || []);
        });
      } else {
        setPage(newPage);
      }
    }
  };

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
      <input
        placeholder="Search by title..."
        value={q}
        onChange={e => { setQ(e.target.value); setPage(1); }}
        style={{ marginBottom: 16, padding: 8, width: 300 }}
      />
      <BookCardGrid
        books={books}
        onBorrow={handleBorrow}
        canBorrow={role === 'member'}
      />
      <div style={{ display: 'flex', justifyContent: 'center', margin: '24px 0' }}>
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page <= 1}
          style={{ marginRight: 12, padding: '6px 16px', borderRadius: 6, border: 'none', background: '#e0e0e0', cursor: page <= 1 ? 'not-allowed' : 'pointer' }}
        >
          Previous
        </button>
        <span style={{ alignSelf: 'center', fontWeight: 500 }}>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page >= totalPages}
          style={{ marginLeft: 12, padding: '6px 16px', borderRadius: 6, border: 'none', background: '#e0e0e0', cursor: page >= totalPages ? 'not-allowed' : 'pointer' }}
        >
          Next
        </button>
      </div>
      {msg && <div className="message">{msg}</div>}
    </div>
  );
}