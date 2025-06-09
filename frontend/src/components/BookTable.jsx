// src/components/BookTable.jsx
export default function BookTable({ books, onBorrow, onEdit, onDelete, canBorrow, canEdit, canDelete }) {
  return (
    <table className="librarian-table">
      <thead>
        <tr>
          <th>Image</th>
          <th>Title</th>
          <th>Author</th>
          <th>Year</th>
          <th>Publisher</th>
          <th>Status</th>
          {(canBorrow || canEdit || canDelete) && <th>Action</th>}
        </tr>
      </thead>
      <tbody>
        {books.length === 0 ? (
          <tr>
            <td colSpan={7} style={{ textAlign: 'center', color: '#888' }}>No books found</td>
          </tr>
        ) : (
          books.map(book => (
            <tr key={book.id}>
              <td><img src={book.image_url} alt={book.title} style={{ width: 50, height: 70, objectFit: 'cover' }} /></td>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.publication_year}</td>
              <td>{book.publisher}</td>
              <td>{book.available ? 'Available' : 'Borrowed'}</td>
              <td>
                {canBorrow && book.available && <button onClick={() => onBorrow(book.id)}>Borrow</button>}
                {canEdit && <button onClick={() => onEdit(book)}>Edit</button>}
                {canDelete && <button onClick={() => onDelete(book.id)}>Delete</button>}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}