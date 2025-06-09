import { useState, useEffect } from 'react';
import axios from 'axios';
import AuthForm from '../components/AuthForm';
import { fetchBooks, createBook, updateBook, deleteBook } from '../api';
import BookTable from '../components/BookTable';
import BookForm from '../components/BookForm';

export default function AdminPanel() {
  // Admin/librarian management
  const [pending, setPending] = useState([]);
  const [approved, setApproved] = useState([]);
  const [msg, setMsg] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get('http://localhost:3000/admin/pending_librarians', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setPending(res.data));

    axios.get('http://localhost:3000/admin/approved_librarians', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setApproved(res.data));
  }, [token]);

  const handleAddAdmin = async (values, { resetForm }) => {
    try {
      const res = await axios.post('http://localhost:3000/admin/add_admin', values, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMsg(res.data.message);
      resetForm();
    } catch (err) {
      setMsg('Error creating admin');
    }
  };

  const handleApprove = async (id) => {
    await axios.post('http://localhost:3000/admin/approve_librarian', { id }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setPending(pending.filter(l => l.id !== id));
    axios.get('http://localhost:3000/admin/approved_librarians', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setApproved(res.data));
  };

  const adminFields = [
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'password', label: 'Password', type: 'password' }
  ];

  // Book management
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

  useEffect(() => { fetchBooks().then(setBooks); }, []);

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
    fetchBooks().then(setBooks);
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
    <div style={{ maxWidth: 700, margin: '2rem auto' }}>
      <h2>Add New Admin</h2>
      <AuthForm
        initialValues={{ email: '', password: '' }}
        onSubmit={handleAddAdmin}
        fields={adminFields}
        buttonLabel="Add Admin"
        message={msg}
      />

      <h2 style={{ marginTop: '2rem' }}>Pending Librarians</h2>
      <table className="librarian-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {pending.length === 0 ? (
            <tr>
              <td colSpan={2} style={{ textAlign: 'center', color: '#888' }}>No pending librarians</td>
            </tr>
          ) : (
            pending.map(l => (
              <tr key={l.id}>
                <td>{l.email}</td>
                <td>
                  <button onClick={() => handleApprove(l.id)}>Approve</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <h2 style={{ marginTop: '2rem' }}>Approved Librarians</h2>
      <table className="librarian-table">
        <thead>
          <tr>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {approved.length === 0 ? (
            <tr>
              <td style={{ textAlign: 'center', color: '#888' }}>No approved librarians</td>
            </tr>
          ) : (
            approved.map(l => (
              <tr key={l.id}>
                <td>{l.email}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <h2 style={{ marginTop: '2rem' }}>Manage Books</h2>
      <BookForm
        initialValues={formInitial}
        onSubmit={handleBookSubmit}
        editing={editing}
        onCancel={() => setEditing(null)}
      />
      <BookTable books={books} onEdit={handleEdit} onDelete={handleDelete} canEdit canDelete />
      {msg && <div className="message">{msg}</div>}
    </div>
  );
}