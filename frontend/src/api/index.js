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