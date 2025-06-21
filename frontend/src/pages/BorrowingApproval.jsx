import { useEffect, useState } from 'react';
import { fetchPendingReturns, ApproveReturn, fetchBorrowings } from '../api';
import FlexTable from '../components/FlexTable';

function ApproveButton({ id, onApprove }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    await onApprove(id);
    setLoading(false);
  };

  return (
    <button
      className="nav-link"
      style={{
        background: '#a5d6a7',
        color: '#234c2e',
        border: 'none',
        borderRadius: 6,
        padding: '0.4rem 1rem',
        fontSize: '1rem',
        cursor: 'pointer',
        transition: 'background 0.2s',
        minWidth: 90,
        opacity: loading ? 0.7 : 1,
      }}
      onClick={handleClick}
      disabled={loading}
    >
      {loading ? 'Approving...' : 'Approve'}
    </button>
  );
}

export default function BorrowingApproval() {
  const [pending, setPending] = useState([]);
  const [msg, setMsg] = useState('');
  const [allBorrowings, setAllBorrowings] = useState([]);

  useEffect(() => {
    fetchPendingReturns().then(setPending);
    fetchBorrowings().then(setAllBorrowings);
  }, []);

  const handleApprove = async (id) => {
    try {
      await ApproveReturn(id);
      setMsg('Return approved!');
      setPending(pending => pending.filter(b => b.id !== id));
      fetchBorrowings().then(setAllBorrowings);
    } catch {
      setMsg('Error approving return');
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '2rem auto' }}>
      <h2 style={{display:'inline-block',borderBottom:'2px solid green', paddingBottom:'5px'}}>Pending Book Returns</h2>
      {msg && <div className="message">{msg}</div>}
      <FlexTable
        columns={[
          { header: 'Book', accessor: row => row.book?.title || 'N/A' },
          { header: 'Member Email', accessor: row => row.user?.email || 'N/A' },
          { header: 'Borrowed At', accessor: row => row.borrowed_at ? new Date(row.borrowed_at).toLocaleString() : '-' },
          { header: 'Return Requested At', accessor: row => row.updated_at ? new Date(row.updated_at).toLocaleString() : '-' },
        ]}
        data={pending}
        emptyMessage="No pending returns"
        getRowKey={row => row.id}
        actions={row => (
          <ApproveButton id={row.id} onApprove={handleApprove} />
        )}
      />

      <h2 style={{ marginTop: '2rem',display:'inline-block',borderBottom:'2px solid green', paddingBottom:'5px' }}>All Borrowing Records</h2>
      <div style={{ overflowX: 'auto' }}>
        <FlexTable
          columns={[
            { header: 'Book', accessor: row => row.book?.title || 'N/A' },
            { header: 'Member Email', accessor: row => row.user?.email || 'N/A' },
            { header: 'Borrowed At', accessor: row => row.borrowed_at ? new Date(row.borrowed_at).toLocaleString() : '-' },
            { header: 'Returned At', accessor: row => row.returned_at ? new Date(row.returned_at).toLocaleString() : 'Not returned' }
          ]}
          data={allBorrowings}
          emptyMessage="No borrowings"
          getRowKey={row => row.id}
        />
      </div>
    </div>
  );
}