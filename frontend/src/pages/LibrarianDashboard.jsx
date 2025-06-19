import { useState, useEffect } from 'react';
import { fetchBorrowings } from '../api';
import BookManager from '../components/BookManager';

export default function LibrarianDashboard() {
  const [borrowings, setBorrowings] = useState([]);

  useEffect(() => {
    fetchBorrowings().then(setBorrowings);
  }, []);

  return (
    <div style={{ maxWidth: 1200, margin: '2rem auto' }}>
      <h1 style={{ textAlign: 'center', color: '#388e3c', marginTop: '2rem' }}>Librarian Dashboard</h1>
      <h2>Manage Books</h2>
      <BookManager canEdit canDelete showForm showActions />
    </div>
  );
}