import React from 'react';

export default function FlexTable({ columns, data, emptyMessage = "No records", getRowKey, actions }) {
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
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (actions ? 1 : 0)} style={{ textAlign: 'center', color: '#888' }}>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
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
    </div>
  );
}