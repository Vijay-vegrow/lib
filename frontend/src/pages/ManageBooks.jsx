import BookManager from '../components/BookManager';

export default function ManageBooks() {
  return (
    <div style={{ maxWidth: 1200, margin: '2rem auto' }}>
      <h2 style={{display:'inline-block',borderBottom:'2px solid green', paddingBottom:'5px'}}>Manage Books</h2>
      <BookManager canEdit canDelete showForm showActions />
    </div>
  );
}