import BookManager from '../components/BookManager';

export default function ManageBooks() {
  return (
    <div style={{ maxWidth: 1200, margin: '2rem auto' }}>
      <h2>Manage Books</h2>
      <BookManager canEdit canDelete showForm showActions />
    </div>
  );
}