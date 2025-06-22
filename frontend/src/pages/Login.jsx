import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api';
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

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [msgKey, setMsgKey] = useState(0);
  const { token, role, login: authLogin } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in and token is valid
  useEffect(() => {
    if (token && !isTokenExpired(token)) {
      navigate(getHomePage(role), { replace: true });
    }
  }, [token, role, navigate]);

  const initialValues = { email, password };
  const fields = [
    { label: 'Email', name: 'email', type: 'email', required: true },
    { label: 'Password', name: 'password', type: 'password', required: true },
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
      const data = await login(values.email, values.password);
      if (data.token) {
        showMessage('Login successful! Redirecting...');
        authLogin(data.token, data.role);
        window.location.href = data.redirect_to;
      } else {
        showMessage(data.error || 'Login failed');
      }
    } catch {
      showMessage('Login failed');
    }
  };

  return (
    <>
      <TimedMessage key={msgKey} message={message} onClose={() => setMessage('')} />
      <AuthForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        fields={fields}
        buttonLabel="Login"
      />
      <div className='google-auth'>
        <GoogleAuthButton />
      </div>
    </>
  );
}