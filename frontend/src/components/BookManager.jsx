import { useState, useEffect } from 'react';
import BookForm from './BookForm';
import BookCardGrid from './BookCardGrid';
import { fetchBooks, createBook, updateBook, deleteBook } from '../api';

export default function BookManager({
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

  useEffect(() => {
    fetchBooks().then(data => setBooks(Array.isArray(data.books) ? data.books : []));
  }, []);

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
      await deleteBook(id);
      setMsg('Book deleted successfully!');
      fetchBooks().then(setBooks);
    } catch (err) {
      setMsg(
        err.response?.data?.error ||
        err.response?.data?.errors?.[0] ||
        "Error deleting book"
      );
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
      fetchBooks().then(setBooks);
    } catch {
      setMsg('Error saving book');
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
        onEdit={canEdit ? handleEdit : undefined}
        onDelete={canDelete ? handleDelete : undefined}
        canEdit={canEdit}
        canDelete={canDelete}
        showActions={showActions}
      />
    </div>
  );
}