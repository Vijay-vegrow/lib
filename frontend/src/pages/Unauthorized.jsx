import { use } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

export default function Unauthorized() {
    const navigate = useNavigate();
    const {role} = useAuth();
    let page = '/';
    if(role === 'admin') page = '/admin/panel';
    else if(role === 'librarian') page = '/librarian/dashboard';
    else if(role === 'member') page = '/books';
  return (
    <div
      style={{
        maxWidth: 480,
        margin: '4rem auto',
        padding: '2.5rem 2rem',
        background: 'rgba(255,255,255,0.95)',
        borderRadius: 16,
        boxShadow: '0 2px 16px rgba(200,46,46,0.08)',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: 64, color: '#c62828', marginBottom: 16 }}>⛔</div>
      <h2 style={{ color: '#c62828', fontWeight: 700, marginBottom: 12 }}>
        Unauthorized Access
      </h2>
      <p style={{ color: '#444', fontSize: 18, marginBottom: 24 }}>
        You do not have permission to view this page.<br />
        Please contact your administrator if you believe this is a mistake.
      </p>
      <a
        onClick={() => navigate(page)}
        style={{
          color: '#388e3c',
          textDecoration: 'none',
          fontWeight: 600,
          fontSize: 16,
          padding: '0.5rem 1.5rem',
          borderRadius: 6,
          background: '#e8f5e9',
          transition: 'background 0.2s',
        }}
        onMouseOver={e => (e.currentTarget.style.background = '#c8e6c9')}
        onMouseOut={e => (e.currentTarget.style.background = '#e8f5e9')}
      >
        Go to Home
      </a>
    </div>
  );
}