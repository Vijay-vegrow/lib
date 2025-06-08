import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

function Logout({ setToken }) {
  const navigate = useNavigate();
  React.useEffect(() => {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/login');
  }, [navigate, setToken]);
  return <div>Logging out...</div>;
}

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Listen for token changes in localStorage (e.g., from other tabs)
  useEffect(() => {
    const handler = () => setToken(localStorage.getItem('token'));
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  return (
    <BrowserRouter>
      <nav>
        {!token && (
          <>
            <Link to="/signup">Signup</Link> | <Link to="/login">Login</Link>
          </>
        )}
        {token && (
          <Link to="/logout">Logout</Link>
        )}
      </nav>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/logout" element={<Logout setToken={setToken} />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/librarian/dashboard" element={<Dashboard />} />
        <Route path="/member/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;