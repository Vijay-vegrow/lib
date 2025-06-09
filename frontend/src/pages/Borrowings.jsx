// src/pages/Borrowings.jsx
import { useState, useEffect } from 'react';
import { fetchBorrowings, returnBook } from '../api';

export default function Borrowings() {
  const [borrowings, setBorrowings] = useState([]);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetchBorrowings().then(setBorrowings);
  }, []);

  const handleReturn = async (id) => {
    await returnBook(id);
    setMsg('Book returned!');
    fetchBorrowings().then(setBorrowings);
  };

  return (
    <div style={{ maxWidth: 900, margin: '2rem auto' }}>
      <h2>Your Borrowing History</h2>
      <table className="librarian-table">
        <thead>
          <tr>
            <th>Book</th>
            <th>Borrowed At</th>
            <th>Returned At</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {borrowings.length === 0 ? (
            <tr>
              <td colSpan={4} style={{ textAlign: 'center', color: '#888' }}>No borrowings</td>
            </tr>
          ) : (
            borrowings.map(b => (
              <tr key={b.id}>
                <td>{b.book.title}</td>
                <td>{b.borrowed_at ? new Date(b.borrowed_at).toLocaleString() : '-'}</td>
                <td>{b.returned_at ? new Date(b.returned_at).toLocaleString() : 'Not returned'}</td>
                <td>
                  {!b.returned_at && <button onClick={() => handleReturn(b.id)}>Return</button>}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {msg && <div className="message">{msg}</div>}
    </div>
  );
}