import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Dashboard() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Not authenticated');
      setLoading(false);
      return;
    }

    const path = window.location.pathname;
    let endpoint = '';
    if (path.startsWith('/admin')) endpoint = '/admin/dashboard';
    else if (path.startsWith('/librarian')) endpoint = '/librarian/dashboard';
    else if (path.startsWith('/member')) endpoint = '/member/dashboard';

    axios.get(`http://localhost:3000${endpoint}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setMessage(res.data.message);
        setLoading(false);
      })
      .catch(() => {
        setMessage('Unauthorized or error loading dashboard');
        setLoading(false);
      });
  }, []);

  return (
    <>
      <h1 style={{ textAlign: 'center', color: '#388e3c', marginTop: '2rem' }}>Vegrow Library</h1>
      <div className="dashboard-message">{loading ? "Loading..." : message}</div>
    </>
  );
}