import Signup from './pages/Signup';
import Login from './pages/Login';
import AdminPanel from './pages/AdminPanel';
import Books from './pages/Books';
import Borrowings from './pages/Borrowings';
import LibrarianDashboard from './pages/LibrarianDashboard';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

function Logout({ setToken }) {
  const navigate = useNavigate();
  React.useEffect(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setToken(null);
    navigate('/login');
  }, [navigate, setToken]);
  return <div>Logging out...</div>;
}

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [role, setRole] = useState(localStorage.getItem('role'));

  useEffect(() => {
    const handler = () => {
      setToken(localStorage.getItem('token'));
      setRole(localStorage.getItem('role'));
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  return (
    <BrowserRouter>
      <nav
        style={{
          background: 'rgba(255,255,255,0.85)',
          padding: '1rem 2rem',
          borderRadius: '0 0 16px 16px',
          boxShadow: '0 2px 8px rgba(34,76,46,0.05)',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '2rem',
          justifyContent: 'space-between'
        }}
      >
        <span style={{
          fontFamily: 'Inter, Segoe UI, Arial, sans-serif',
          fontWeight: 800,
          fontSize: '1.7rem',
          color: '#388e3c',
          letterSpacing: '1px',
          textShadow: '0 2px 8px #e8f5e9'
        }}>
          Vegrow Library
        </span>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {!token && (
            <>
              <Link to="/signup">Signup</Link>
              <Link to="/login">Login</Link>
            </>
          )}
          {token && (
            <>
              {role === 'member' && (
                <>
                  <Link to="/books">Books</Link>
                  <Link to="/borrowings">Borrowing History</Link>
                </>
              )}
              {role === 'admin' && (
                <Link to="/admin/panel">Admin Panel</Link>
              )}
              {role === 'librarian' && (
                <Link to="/librarian/dashboard">Librarian Dashboard</Link>
              )}
              <Link to="/logout">Logout</Link>
            </>
          )}
        </div>
      </nav>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/logout" element={<Logout setToken={setToken} />} />
        <Route path="/admin/panel" element={<AdminPanel />} />
        <Route path="/librarian/dashboard" element={<LibrarianDashboard />} />
        <Route path="/books" element={<Books />} />
        <Route path="/borrowings" element={<Borrowings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;