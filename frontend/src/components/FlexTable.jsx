import { useState } from 'react';

export default function FlexTable({
  columns,
  data,
  emptyMessage = "No records",
  getRowKey,
  actions,
  paginated = true,
  defaultRowsPerPage = 10,
}) {
  // Pagination state
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);

  // Paginate data if enabled
  const paginatedData = paginated
    ? data.slice((page - 1) * rowsPerPage, page * rowsPerPage)
    : data;

  const totalPages = paginated ? Math.ceil(data.length / rowsPerPage) : 1;

  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="librarian-table" style={{ minWidth: 600 }}>
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.header}>{col.header}</th>
            ))}
            {actions && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {paginatedData.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (actions ? 1 : 0)} style={{ textAlign: 'center', color: '#888' }}>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            paginatedData.map((row, idx) => (
              <tr key={getRowKey ? getRowKey(row, idx) : idx}>
                {columns.map(col => (
                  <td key={col.header}>
                    {typeof col.accessor === 'function' ? col.accessor(row) : row[col.accessor]}
                  </td>
                ))}
                {actions && (
                  <td>
                    {actions(row)}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
      {paginated && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 16, justifyContent: 'flex-end' }}>
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            style={{ padding: '4px 12px', borderRadius: 6, border: '1px solid #ccc', background: '#f8f8f8', cursor: page === 1 ? 'not-allowed' : 'pointer' }}
          >
            Prev
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            style={{ padding: '4px 12px', borderRadius: 6, border: '1px solid #ccc', background: '#f8f8f8', cursor: page === totalPages ? 'not-allowed' : 'pointer' }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}