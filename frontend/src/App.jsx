import { useState, useEffect } from 'react';
import Signup from './pages/Signup';
import Login from './pages/Login';
import AdminPanel from './pages/AdminPanel';
import Books from './pages/Books';
import Borrowings from './pages/Borrowings';
import LibrarianDashboard from './pages/LibrarianDashboard';
import BorrowingApproval from './pages/BorrowingApproval';
import { BrowserRouter, Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import RequireAuth from './components/RequireAuth';
import ManageBooks from './pages/ManageBooks';
import NotFound from './pages/NotFound';
import LandingPage from './pages/LandingPage';
import RoleSelect from './pages/RoleSelect';
import StatsDashboard from './components/StatsDashboard';

function NavBar() {
  const { token, role, logout } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/books?q=${encodeURIComponent(search)}`);
  };

  return (
    <nav style={{
          background: 'rgba(255, 255, 255, 0.7)',
    padding: 0,
    borderRadius: '0 0 16px 16px',
    boxShadow: '0 2px 8px rgba(34, 76, 46, 0.05)',
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    flexWrap: "nowrap", 
    gap: "1.5rem",      // Space between items
    overflowX: "auto", 
    alignItems: 'center',
    padding:'50px'
    }}>
      <div className='box'> 
      <span style={{
        fontFamily: 'Inter, Segoe UI, Arial, sans-serif',
        fontWeight: 800,
        fontSize: '1.7rem',
        color: '#388e3c',
        letterSpacing: '1px',
        textShadow: '0 2px 8px #e8f5e9',
        
      }}>
        Vegrow Library
      </span>
      {token && (
      <span>
        <form onSubmit={handleSearch} style={{display: 'flex', alignItems: 'center', gap: '0.5rem', flexDirection: 'row',
          background:'none',boxShadow:'none',justifyContent: 'center'
        }}>
          <input
            type="text"
            placeholder="Search books..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{background: "rgba(255,255,255,0.8)"}}
          />
          <button
      type="submit"
      style={{
        background: '#388e3c',
        border: 'none',
        borderRadius: '50%',
        width: 35,
        height: 35,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        marginTop:0,

      }}
      aria-label="Search"
    >
     
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="9" cy="9" r="7" stroke="#fff" strokeWidth="2"/>
        <line x1="14.4142" y1="14" x2="18" y2="17.5858" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    </button>
        </form>
      </span>
      )}
      </div>
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
                <NavLink to="/stats" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Stats</NavLink>
              </>
            )}
            {role === 'librarian' && (
              <>
              <NavLink to="/librarian/dashboard" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Manage books</NavLink>
                <NavLink to="/borrowing-approval" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Borrowing Approval</NavLink>
                <NavLink to="/stats" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Stats</NavLink>
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

  // Main app with NavBar and routes
  return (
    <AuthProvider>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
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
              <RequireAuth>
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
          <Route path="/role-select" element={<RoleSelect />} />
          <Route path="/stats" element={<StatsDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;