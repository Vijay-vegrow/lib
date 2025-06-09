import { useState, useEffect } from 'react';
import { fetchBooks, createBook, updateBook, deleteBook } from '../api';
import BookCardGrid from '../components/BookCardGrid';
import BookForm from '../components/BookForm';

export default function LibrarianDashboard() {
  const [books, setBooks] = useState([]);
  const [editing, setEditing] = useState(null);
  const [formInitial, setFormInitial] = useState({
    title: '',
    author: '',
    publication_year: '',
    publisher: '',
    image_url: '',
    available: true
  });
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetchBooks().then(setBooks);
  }, []);

  const handleEdit = (book) => {
    setEditing(book.id);
    setFormInitial({
      title: book.title,
      author: book.author,
      publication_year: book.publication_year,
      publisher: book.publisher,
      image_url: book.image_url,
      available: book.available
    });
  };

  const handleDelete = async (id) => {
    await deleteBook(id);
    setMsg('Book deleted');
    fetchBooks().then(setBooks);
  };

  const handleSubmit = async (values, { resetForm }) => {
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
    <div style={{ maxWidth: 1200, margin: '2rem auto' }}>
      <h1 style={{ textAlign: 'center', color: '#388e3c', marginTop: '2rem' }}>Librarian Dashboard</h1>
      <h2>{editing ? 'Edit Book' : 'Add Book'}</h2>
      <BookForm
        initialValues={formInitial}
        onSubmit={handleSubmit}
        editing={editing}
        onCancel={() => setEditing(null)}
      />
      {msg && <div className="message">{msg}</div>}
      <h2 style={{ marginTop: '2rem' }}>Books</h2>
      <BookCardGrid
        books={books}
        onEdit={handleEdit}
        onDelete={handleDelete}
        canEdit
        canDelete
        showActions
      />
    </div>
  );
}