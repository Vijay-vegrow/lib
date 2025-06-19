// src/pages/Borrowings.jsx
import { useState, useEffect } from 'react';
import { fetchBorrowings, returnBook } from '../api';
import FlexTable from '../components/FlexTable';

export default function Borrowings() {
  const [borrowings, setBorrowings] = useState([]);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetchBorrowings().then(setBorrowings);
  }, []);

  const handleReturn = async (id) => {
    try {
      await returnBook(id);
      setMsg('Return requested. Awaiting librarian approval.');
      setTimeout(() => {
        fetchBorrowings().then(setBorrowings);
      }, 500);
    } catch {
      setMsg('Error requesting return.');
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '2rem auto' }}>
      <h2>Your Borrowing History</h2>
      <FlexTable
        columns={[
          { header: 'Book', accessor: row => row.book?.title || 'N/A' },
          { header: 'Borrowed At', accessor: row => row.borrowed_at ? new Date(row.borrowed_at).toLocaleString() : '-' },
          { header: 'Returned At', accessor: row => row.returned_at ? new Date(row.returned_at).toLocaleString() : 'Not returned' },
          {
            header: 'Status',
            accessor: row => {
              if (row.status === 'borrowed') {
                return (
                  <button onClick={() => handleReturn(row.id)}>
                    Return
                  </button>
                );
              }
              if (row.status === 'return_requested') {
                return <span style={{ color: '#c68a00' }}>Awaiting approval</span>;
              }
              if (row.status === 'returned') {
                return <span style={{ color: '#388e3c' }}>Returned</span>;
              }
              return row.status;
            }
          }
        ]}
        data={borrowings}
        emptyMessage="No borrowings"
        getRowKey={row => row.id}
      />
      {msg && <div className="message">{msg}</div>}
    </div>
  );
}