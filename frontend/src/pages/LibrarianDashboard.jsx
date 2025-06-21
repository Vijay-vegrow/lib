import BookManager from '../components/BookManager';

export default function LibrarianDashboard() {


  return (
    <div style={{ maxWidth: 1200, margin: '2rem auto' }}>
      <h1 style={{ textAlign: 'center', color: '#388e3c', marginTop: '2rem' }}>Librarian Dashboard</h1>
      <h2 style={{display:'inline-block',borderBottom:'2px solid green', paddingBottom:'5px'}}>Manage Books</h2>
      <BookManager canEdit canDelete showForm showActions />
    </div>
  );
}