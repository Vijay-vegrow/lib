import { useState, useMemo, useEffect } from 'react';

export default function FlexTable({
  columns,
  data,
  emptyMessage = "No records",
  getRowKey,
  actions,
  paginated = true,
  defaultRowsPerPage = 10,
}) {
  // Search state
  const [search, setSearch] = useState("");
  // Pagination state
  const [page, setPage] = useState(1);
  const rowsPerPage = defaultRowsPerPage;

  // Filter data by search (only string accessors)
  const filteredData = useMemo(() => {
    if (!search) return data;
    const lower = search.toLowerCase();
    return data.filter(row =>
      columns.some(col => {
        let value;
        if (typeof col.accessor === "function") {
          // Try to get a string value for searching
          value = col.accessor(row);
          // If it's a React element, skip
          if (typeof value === "object") return false;
        } else {
          value = row[col.accessor];
        }
        return String(value ?? "")
          .toLowerCase()
          .includes(lower);
      })
    );
  }, [search, data, columns]);

  // Paginate data if enabled
  const paginatedData = paginated
    ? filteredData.slice((page - 1) * rowsPerPage, page * rowsPerPage)
    : filteredData;

  const totalPages = paginated ? Math.ceil(filteredData.length / rowsPerPage) : 1;

  // Reset to first page on search
  useEffect(() => {
    setPage(1);
  }, [search]);

  // Helper to render page buttons
  function renderPageButtons() {
    if (totalPages <= 1) return null;
    const buttons = [];
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => setPage(i)}
          style={{
            margin: "0 2px",
            padding: "2px 8px",
            borderRadius: 4,
            border: i === page ? "1.5px solid #388e3c" : "1px solid #ccc",
            background: i === page ? "#e8f5e9" : "#fff",
            color: i === page ? "#388e3c" : "#333",
            fontWeight: i === page ? 700 : 400,
            fontSize: 13,
            cursor: i === page ? "default" : "pointer",
            minWidth: 28,
          }}
          disabled={i === page}
        >
          {i}
        </button>
      );
    }
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
        {buttons}
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      {/* Search */}
      <div style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
        <input
          type="text"
          placeholder="Search…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            padding: "8px 12px",
            borderRadius: 6,
            border: "1px solid #ccc",
            minWidth: 200,
          }}
        />
      </div>
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
      {paginated && renderPageButtons()}
    </div>
  );
}