import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../api';
import AuthForm from '../components/AuthForm';
import GoogleAuthButton from '../components/GoogleAuthButton';
import TimedMessage from '../components/TimedMessage';
import { useAuth } from '../context/AuthContext';

function getHomePage(role) {
  if (role === 'admin') return '/admin/panel';
  if (role === 'librarian') return '/librarian/dashboard';
  if (role === 'member') return '/books';
  return '/';
}

function isTokenExpired(token) {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (!payload.exp) return false;
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
}

export default function Signup() {
  const [message, setMessage] = useState('');
  const [msgKey, setMsgKey] = useState(0);
  const initialValues = { role: 'member', email: '', password: '' };
  const { token, role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (token && !isTokenExpired(token)) {
      navigate(getHomePage(role), { replace: true });
    }
  }, [token, role, navigate]);

  const fields = [
    {
      name: 'role',
      label: 'Role',
      as: 'select',
      options: [
        { value: 'librarian', label: 'Librarian' },
        { value: 'member', label: 'Member' }
      ]
    },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'password', label: 'Password', type: 'password' }
  ];

  const showMessage = (msg) => {
    setMessage('');
    setTimeout(() => {
      setMsgKey(prev => prev + 1);
      setMessage(msg);
    }, 20);
  };

  const handleSubmit = async (values) => {
    try {
      const data = await signup(values.role, values.email, values.password);
      if (data.errors) {
        showMessage(data.errors.join(', '));
      } else if (values.role === 'librarian') {
        showMessage('Signup successful! Await admin approval before you can login.');
      } else {
        showMessage('Signup successful! You can now log in.');
      }
    } catch {
      showMessage('Signup failed');
    }
  };

  return (
    <>
      <TimedMessage key={msgKey} message={message} onClose={() => setMessage('')} />
      <AuthForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        fields={fields}
        buttonLabel="Signup"
      />
      <div className='google-auth'>
        <GoogleAuthButton />
      </div>
    </>
  );
}