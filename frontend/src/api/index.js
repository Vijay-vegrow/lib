import axios from 'axios';

const API_BASE = 'http://localhost:3000';

export function signup(role, email, password) {
  return axios.post(`${API_BASE}/signup/${role}`, { email, password })
    .then(res => res.data);
}

export function login(email, password) {
  return axios.post(`${API_BASE}/login`, { email, password })
    .then(res => res.data);
}

export function fetchBooks(q = '') {
  return axios.get(`${API_BASE}/books`, {
    params: q ? { q } : {},
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  }).then(res => res.data);
}

export function createBook(book) {
  return axios.post(`${API_BASE}/books`, book, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
}

export function updateBook(id, book) {
  return axios.put(`${API_BASE}/books/${id}`, book, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
}

export function deleteBook(id) {
  return axios.delete(`${API_BASE}/books/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
}

export function borrowBook(book_id) {
  return axios.post(`${API_BASE}/borrowings`, { book_id }, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
}

export function returnBook(borrowing_id) {
  return axios.post(`${API_BASE}/borrowings/${borrowing_id}/return`, {}, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
}

export function fetchBorrowings() {
  return axios.get(`${API_BASE}/borrowings`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  }).then(res => res.data);
}