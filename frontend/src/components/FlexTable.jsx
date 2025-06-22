import { useState, useMemo, useEffect } from 'react';

export default function FlexTable({
  columns,
  data,
  emptyMessage = "No records",
  getRowKey,
  actions,
  paginated = true,
  defaultRowsPerPage = 5,
}) {
  // Search state
  const [search, setSearch] = useState("");
  // Pagination state
  const [page, setPage] = useState(1);
  const rowsPerPage = defaultRowsPerPage;

  // Sorting state
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'

  // Filter data by search (only string accessors)
  const filteredData = useMemo(() => {
    if (!search) return data;
    const lower = search.toLowerCase();
    return data.filter(row =>
      columns.some(col => {
        let value;
        if (typeof col.accessor === "function") {
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

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortBy) return filteredData;
    const col = columns.find(c => c.header === sortBy);
    if (!col) return filteredData;
    const accessor = col.accessor;
    const compare = (a, b) => {
      let aVal = typeof accessor === "function" ? accessor(a) : a[accessor];
      let bVal = typeof accessor === "function" ? accessor(b) : b[accessor];
      // If values are numbers, compare numerically
      if (!isNaN(parseFloat(aVal)) && !isNaN(parseFloat(bVal))) {
        aVal = parseFloat(aVal);
        bVal = parseFloat(bVal);
      } else {
        aVal = String(aVal ?? '').toLowerCase();
        bVal = String(bVal ?? '').toLowerCase();
      }
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    };
    return [...filteredData].sort(compare);
  }, [filteredData, sortBy, sortOrder, columns]);

  // Paginate data if enabled
  const paginatedData = paginated
    ? sortedData.slice((page - 1) * rowsPerPage, page * rowsPerPage)
    : sortedData;

  const totalPages = paginated ? Math.ceil(sortedData.length / rowsPerPage) : 1;

  // Reset to first page on search or sort
  useEffect(() => {
    setPage(1);
  }, [search, sortBy, sortOrder]);

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

  // Sorting options: only columns with string accessor or function accessor
  const sortableColumns = columns.filter(
    col => typeof col.accessor === "string" || typeof col.accessor === "function"
  );

  return (
    <div style={{ overflowX: 'auto' }}>
      {/* Search and Sort Row */}
      <div style={{
        marginBottom: 16,
        display: "flex",
        alignItems: "center",
        gap: 12,
        justifyContent: "space-between"
      }}>
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
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
          <label style={{ fontSize: 14, color: "#555" }}>Sort by:</label>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #ccc" }}
          >
            <option value="">None</option>
            {sortableColumns.map(col => (
              <option key={col.header} value={col.header}>{col.header}</option>
            ))}
          </select>
          <button
            style={{
              padding: "4px 10px",
              borderRadius: 6,
              border: "1px solid #ccc",
              background: "#f8f8f8",
              cursor: "pointer",
              fontSize: 13,
              marginLeft: 4
            }}
            onClick={() => setSortOrder(o => o === 'asc' ? 'desc' : 'asc')}
            disabled={!sortBy}
            title="Toggle sort order"
          >
            {sortOrder === 'asc' ? '▲' : '▼'}
          </button>
        </div>
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