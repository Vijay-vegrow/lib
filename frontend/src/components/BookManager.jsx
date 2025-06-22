import { useState, useEffect } from 'react';
import BookForm from './BookForm';
import BookCardGrid from './BookCardGrid';
import { fetchBooks, createBook, updateBook, deleteBook, borrowBook } from '../api';
import Swal from 'sweetalert2'
import TimedMessage from './TimedMessage';

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

  // Always use current search, page, perPage for fetching
  const refetchBooks = (customPage = page) => {
    fetchBooks(search, customPage, perPage).then(data => {
      setBooks(Array.isArray(data.books) ? data.books : []);
      setTotalPages(data.total_pages || 1);
      // Prefetch next page if possible
      if (customPage < (data.total_pages || 1)) {
        fetchBooks(search, customPage + 1, perPage).then(nextData => {
          setPrefetched(Array.isArray(nextData.books) ? nextData.books : []);
        });
      } else {
        setPrefetched(null);
      }
    });
  };

  useEffect(() => {
    refetchBooks();
    // eslint-disable-next-line
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
        refetchBooks();
      } else {
        setMsg('Error deleting book');
      }
    } catch (err) {
      const backendMsg =
        err?.response?.data?.error ||
        err?.response?.data?.errors?.[0] ||
        err?.message ||
        "Error deleting book";
      if (
        backendMsg.toLowerCase().includes('borrowed') ||
        backendMsg.toLowerCase().includes('pending return')
      ) {
        setMsg('Cannot delete: Book is currently borrowed.');
      } else {
        setMsg(backendMsg);
      }
      refetchBooks();
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
      refetchBooks();
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
      refetchBooks();
    } catch (err) {
      setMsg('Error borrowing book');
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      if (newPage === page + 1 && prefetched) {
        setBooks(prefetched);
        setPage(newPage);
        // Prefetch next page after moving
        fetchBooks(search, newPage + 1, perPage).then(nextData => {
          setPrefetched(Array.isArray(nextData.books) ? nextData.books : []);
        });
      } else {
        setPage(newPage);
      }
    }
  };

  // Helper to generate a windowed page button array with ellipsis
  function getPageButtons(current, total) {
    const window = 2;
    let pages = [];

    // Always show first page
    pages.push(1);

    // Show left ellipsis if needed
    if (current - window > 2) {
      pages.push('...');
    }

    // Show window of pages around current
    for (let i = Math.max(2, current - window); i <= Math.min(total - 1, current + window); i++) {
      pages.push(i);
    }

    // Show right ellipsis if needed
    if (current + window < total - 1) {
      pages.push('...');
    }

    // Always show last page if more than one page
    if (total > 1) {
      pages.push(total);
    }

    // Remove duplicates while preserving order
    return pages.filter((v, i, a) => a.indexOf(v) === i);
  }

  // Render small, centered page buttons with ellipsis for large page counts
  const renderPageButtons = () => {
    if (totalPages <= 1) return null;
    const buttons = getPageButtons(page, totalPages);
    return (
      <div style={{ display: "flex", justifyContent: "center", margin: "24px 0" }}>
        {buttons.map((btn, idx) =>
          btn === "..." ? (
            <span key={`ellipsis-${idx}`} style={{ padding: "2px 8px", color: "#888", fontSize: 13 }}>…</span>
          ) : (
            <button
              key={btn}
              onClick={() => handlePageChange(btn)}
              style={{
                margin: "0 2px",
                padding: "2px 10px",
                borderRadius: 4,
                border: btn === page ? "1.5px solid #388e3c" : "1px solid #ccc",
                background: btn === page ? "#e8f5e9" : "#fff",
                color: btn === page ? "#388e3c" : "#333",
                fontWeight: btn === page ? 700 : 400,
                fontSize: 13,
                cursor: btn === page ? "default" : "pointer",
                minWidth: 28,
              }}
              disabled={btn === page}
            >
              {btn}
            </button>
          )
        )}
      </div>
    );
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
      <TimedMessage message={msg} onClose={() => setMsg('')} />
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
      {renderPageButtons()}
    </div>
  );
}