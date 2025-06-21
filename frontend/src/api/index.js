import axios from 'axios';

const API_BASE = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response && (err.response.status === 401 || err.response.status === 403)) {
      window.dispatchEvent(new Event('force-logout'));
    }
    return Promise.reject(err);
  }
);

export function signup(role, email, password) {
  return api.post(`/signup/${role}`, { email, password }).then(res => res.data);
}

export function login(email, password) {
  return api.post('/login', { email, password }).then(res => res.data);
}

export function fetchBooks(q = '', page = 1, perPage = 10) {
  return api.get('/books', {
    params: { ...(q ? { q } : {}), page, per_page: perPage },
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  }).then(res => res.data);
}

export function createBook(book) {
  return api.post('/books', { book }, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
}

export function updateBook(id, book) {
  return api.put(`/books/${id}`, { book }, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
}

export function deleteBook(id) {
  return api.delete(`/books/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      Accept: 'application/json'
    }
  });
}

export function borrowBook(book_id) {
  return api.post('/borrowings', { book_id }, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
}

export function returnBook(borrowing_id) {
  return api.post(`/borrowings/${borrowing_id}/return`, {}, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
}

export function fetchBorrowings() {
  return api.get('/borrowings', {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  }).then(res => res.data);
}

export function ApproveReturn(borrowing_id) {
  return api.post(`/borrowings/${borrowing_id}/approve_return`, {}, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
}

export function fetchPendingLibrarians() {
  return api.get('/admin/pending_librarians', {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  }).then(res => res.data);
}

export function fetchApprovedLibrarians() {
  return api.get('/admin/approved_librarians', {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  }).then(res => res.data);
}

export function approveLibrarian(id) {
  return api.post('/admin/approve_librarian', { id }, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
}

export function addAdmin(email, password) {
  return api.post('/admin/add_admin', { email, password }, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  }).then(res => res.data);
}

export function fetchPendingReturns() {
  return api.get('/borrowings/pending_returns', {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  }).then(res => res.data);
}

export function googleOAuthLogin(access_token) {
  return api.post('/auth/google_oauth2_token', { access_token })
    .then(res => res.data);
}

export function assignRole(email, role) {
  return api.post('/api/assign_role', { email, role })
    .then(res => res.data);
}
