import Signup from './pages/Signup';
import Login from './pages/Login';
import AdminPanel from './pages/AdminPanel';
import Books from './pages/Books';
import Borrowings from './pages/Borrowings';
import LibrarianDashboard from './pages/LibrarianDashboard';
import BorrowingApproval from './pages/BorrowingApproval';
import { BrowserRouter, Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import RequireAuth from './components/RequireAuth';
import ManageBooks from './pages/ManageBooks';
import NotFound from './pages/NotFound';

function NavBar() {
  const { token, role, logout } = useAuth();
  return (
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
            <NavLink to="/signup" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Signup</NavLink>
            <NavLink to="/login" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Login</NavLink>
          </>
        )}
        {token && (
          <>
            {role === 'member' && (
              <NavLink to="/books" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Books</NavLink>
            )}
            {role === 'admin' && (
              <>
                <NavLink to="/admin/panel" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Admin Panel</NavLink>
                <NavLink to="/borrowing-approval" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Borrowing Approval</NavLink>
                <NavLink to="/manage-books" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Manage Books</NavLink>
              </>
            )}
            {role === 'librarian' && (
              <>
              <NavLink to="/librarian/dashboard" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Manage books</NavLink>
                <NavLink to="/borrowing-approval" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Borrowing Approval</NavLink>
              </>
            )}
            <a
              href="#"
              onClick={e => {
                e.preventDefault();
                logout();
                window.location.href = '/login';
              }}
              className="nav-link"
            >
              Logout
            </a>
          </>
        )}
      </div>
    </nav>
  );
}

function App() {
  const { logout } = useAuth();

  useEffect(() => {
    const handler = () => {
      logout();
      window.location.href = '/login';
    };
    window.addEventListener('force-logout', handler);
    return () => window.removeEventListener('force-logout', handler);
  }, [logout]);

  return (
    <AuthProvider>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin/panel"
            element={
              <RequireAuth allowedRoles={['admin']}>
                <AdminPanel />
              </RequireAuth>
            }
          />
          <Route
            path="/librarian/dashboard"
            element={
              <RequireAuth allowedRoles={['librarian']}>
                <LibrarianDashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/books"
            element={
              <RequireAuth allowedRoles={['member']}>
                <Books />
              </RequireAuth>
            }
          />
          <Route
            path="/borrowings"
            element={
              <RequireAuth allowedRoles={['member']}>
                <Borrowings />
              </RequireAuth>
            }
          />
          <Route
            path="/borrowing-approval"
            element={
              <RequireAuth allowedRoles={['librarian', 'admin']}>
                <BorrowingApproval />
              </RequireAuth>
            }
          />
        <Route
            path="/manage-books"
            element={
              <RequireAuth allowedRoles={['librarian', 'admin']}>
                <ManageBooks />
              </RequireAuth>
            }
          />
            <Route path="*" element={<NotFound />} />
          </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;