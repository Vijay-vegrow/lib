// src/pages/Books.jsx
import { useState, useEffect } from 'react';
import { fetchBooks, borrowBook } from '../api';
import BookTable from '../components/BookTable';
import { useNavigate } from 'react-router-dom';

export default function Books() {
  const [books, setBooks] = useState([]);
  const [q, setQ] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();
  const role = localStorage.getItem('role');

  useEffect(() => {
    fetchBooks(q).then(setBooks);
  }, [q]);

  const handleBorrow = async (book_id) => {
    try {
      await borrowBook(book_id);
      setMsg('Book borrowed successfully!');
      fetchBooks(q).then(setBooks);
    } catch (err) {
      setMsg('Error borrowing book');
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '2rem auto' }}>
      <h2>Available Books</h2>
      <input
        placeholder="Search by title..."
        value={q}
        onChange={e => setQ(e.target.value)}
        style={{ marginBottom: 16, padding: 8, width: 300 }}
      />
      <BookTable books={books} onBorrow={handleBorrow} canBorrow />
      {msg && <div className="message">{msg}</div>}
    </div>
  );
}