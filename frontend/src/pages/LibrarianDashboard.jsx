import { useState, useEffect } from 'react';
import { fetchBorrowings } from '../api';
import FlexTable from '../components/FlexTable';
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
      <h2 style={{ marginTop: '2rem' }}>All Borrowing Records</h2>
      <FlexTable
        columns={[
          { header: 'Book', accessor: row => row.book?.title || 'N/A' },
          { header: 'Member Email', accessor: row => row.user?.email || 'N/A' },
          { header: 'Borrowed At', accessor: row => row.borrowed_at ? new Date(row.borrowed_at).toLocaleString() : '-' },
          { header: 'Returned At', accessor: row => row.returned_at ? new Date(row.returned_at).toLocaleString() : 'Not returned' }
        ]}
        data={borrowings}
        emptyMessage="No borrowings"
        getRowKey={row => row.id}
      />
    </div>
  );
}