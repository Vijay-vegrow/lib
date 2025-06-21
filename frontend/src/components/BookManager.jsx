import { useState, useEffect } from 'react';
import BookForm from './BookForm';
import BookCardGrid from './BookCardGrid';
import { fetchBooks, createBook, updateBook, deleteBook, borrowBook } from '../api';
import Swal from 'sweetalert2'

export default function BookManager({
  search = '',
  canEdit = false,
  canDelete = false,
  canBorrow = false,
  showForm = false,
  showActions = true,
}) {
  const [books, setBooks] = useState([]);
  const [editing, setEditing] = useState(null);
  const [formInitial, setFormInitial] = useState({
    title: '',
    author: '',
    publication_year: '',
    publisher: '',
    image_url: '',
    availability_count: ''
  });
  const [msg, setMsg] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage] = useState(10);
  const [prefetched, setPrefetched] = useState(null);

  useEffect(() => {
    fetchBooks(search, page, perPage).then(data => {
      setBooks(Array.isArray(data.books) ? data.books : []);
      setTotalPages(data.total_pages || 1);
      if (page < (data.total_pages || 1)) {
        fetchBooks(search, page + 1, perPage).then(nextData => {
          setPrefetched(Array.isArray(nextData.books) ? nextData.books : []);
        });
      } else {
        setPrefetched(null);
      }
    });
  }, [search, page, perPage]);

  useEffect(() => {
    if (editing) {
      const book = books.find(b => b.id === editing);
      setFormInitial(book || formInitial);
    } else {
      setFormInitial({
        title: '',
        author: '',
        publication_year: '',
        publisher: '',
        image_url: '',
        availability_count: ''
      });
    }
    // eslint-disable-next-line
  }, [editing, books]);

  const handleEdit = (book) => {
    setEditing(book.id);
    setFormInitial(book);
  };

  const handleDelete = async (id) => {
    try {
      const res = await deleteBook(id);
      if (res.status === 204) {
        setMsg('Book deleted successfully!');
        fetchBooks().then(data => {
          setBooks(Array.isArray(data.books) ? data.books : []);
          setTotalPages(data.total_pages || 1);
        });
      } else {
        setMsg('Error deleting book');
      }
    } catch (err) {
      const backendMsg =
        err?.response?.data?.error ||
        err?.response?.data?.errors?.[0] ||
        err?.message ||
        "Error deleting book";
      // If backend says book is borrowed, show a friendly message
      if (
        backendMsg.toLowerCase().includes('borrowed') ||
        backendMsg.toLowerCase().includes('pending return')
      ) {
        setMsg('Cannot delete: Book is currently borrowed.');
      } else {
        setMsg(backendMsg);
      }
      // Optionally refetch to keep UI in sync
      fetchBooks().then(data => {
        setBooks(Array.isArray(data.books) ? data.books : []);
        setTotalPages(data.total_pages || 1);
      });
    }
  };

  const handleBookSubmit = async (values, { resetForm }) => {
    try {
      if (editing) {
        await updateBook(editing, values);
        setMsg('Book updated');
      } else {
        await createBook(values);
        setMsg('Book added');
      }
      setEditing(null);
      resetForm();
      fetchBooks().then(data=> {setBooks(Array.isArray(data.books) ? data.books: []);
      setTotalPages(data.total_pages || 1);});
    } catch {
      setMsg('Error saving book');
    }
  };

  const handleBorrow = async (bookId) => {
    try {
      await borrowBook(bookId);
      Swal.fire({
  title: "Borrow successful!",
  text: "Happy reading!",
  icon: "success"
});
      fetchBooks('', page, perPage).then(data => {
        setBooks(Array.isArray(data.books) ? data.books : []);
        setTotalPages(data.total_pages || 1);
      });
    } catch (err) {
      setMsg('Error borrowing book');
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      if (newPage === page + 1 && prefetched) {
        setBooks(prefetched);
        setPage(newPage);
        fetchBooks('', newPage + 1, perPage).then(nextData => {
          setPrefetched(Array.isArray(nextData.books) ? nextData.books : []);
        });
      } else {
        setPage(newPage);
      }
    }
  };

  return (
    <div>
      {showForm && (
        <BookForm
          key={editing || 'new'}
          initialValues={formInitial}
          onSubmit={handleBookSubmit}
          editing={editing}
          onCancel={() => setEditing(null)}
        />
      )}
      {msg && <div className="message">{msg}</div>}
      <BookCardGrid
        books={books}
        onBorrow={canBorrow ? handleBorrow : undefined}
        onEdit={canEdit ? handleEdit : undefined}
        onDelete={canDelete ? handleDelete : undefined}
        canBorrow={canBorrow}
        canEdit={canEdit}
        canDelete={canDelete}
        showActions={showActions}
      />
      <div style={{ display: 'flex', justifyContent: 'center', margin: '24px 0' }}>
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page <= 1}
          style={{
            marginRight: 12,
            padding: '6px 16px',
            borderRadius: 6,
            border: 'none',
            background: page <= 1 ? '#c8e6c9' : '#388e3c',
            color: page <= 1 ? '#888' : '#fff',
            cursor: page <= 1 ? 'not-allowed' : 'pointer',
            fontWeight: 500,
            transition: 'background 0.2s'
          }}
        >
          Previous
        </button>
        <span style={{ alignSelf: 'center', fontWeight: 500 }}>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page >= totalPages}
          style={{
            marginLeft: 12,
            padding: '6px 16px',
            borderRadius: 6,
            border: 'none',
            background: page >= totalPages ? '#c8e6c9' : '#388e3c',
            color: page >= totalPages ? '#888' : '#fff',
            cursor: page >= totalPages ? 'not-allowed' : 'pointer',
            fontWeight: 500,
            transition: 'background 0.2s'
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}