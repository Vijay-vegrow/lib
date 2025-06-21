import { useSearchParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { assignRole } from '../api';

export default function RoleSelect() {
  const [params] = useSearchParams();
  const email = params.get('email');
  const [role, setRole] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!role) {
      setError('Please select a role.');
      return;
    }
    try {
      const data = await assignRole(email, role);
      if (data.token) {
        login(data.token, data.role);
        if (data.role === 'admin') navigate('/admin/panel');
        else if (data.role === 'librarian') navigate('/librarian/dashboard');
        else navigate('/books');
      } else {
        setError(data.error || 'Something went wrong.');
      }
    } catch (err) {
      setError('Something went wrong.');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '4rem auto', padding: 24, background: '#fff', borderRadius: 8 }}>
      <h2>Welcome, {email}</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Select your role:
          <select value={role} onChange={e => setRole(e.target.value)} style={{ marginLeft: 8 }}>
            <option value="">--Select--</option>
            <option value="member">Member</option>
            <option value="librarian">Librarian</option>
          </select>
        </label>
        <button type="submit" style={{ marginLeft: 12 }}>Continue</button>
      </form>
      {error && (
        <div style={{ color: 'red', marginTop: 8, fontWeight: 600 }}>
          {error === 'Librarian account not approved by admin.'
            ? 'Signup successful! Await admin approval before you can login as a librarian.'
            : error}
        </div>
      )}
    </div>
  );
}