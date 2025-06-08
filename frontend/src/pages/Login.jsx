import { useState } from 'react';
import { login } from '../api';
import AuthForm from '../components/AuthForm';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const initialValues = { email, password };
  const fields = [
    { label: 'Email', name: 'email', type: 'email', required: true },
    { label: 'Password', name: 'password', type: 'password', required: true },
  ];

  const handleSubmit = async (values) => {
    const { email, password } = values;
    try {
      const data = await login(email, password);
      if (data.token) {
        setMessage('Login successful! Redirecting...');
        localStorage.setItem('token', data.token);
        window.location.href = data.redirect_to;
      } else {
        setMessage(data.error || 'Login failed');
      }
    } catch (err) {
      setMessage('Login failed');
    }
  };

  return (
    <>
      <h1 style={{ textAlign: 'center', color: '#388e3c', marginTop: '2rem' }}>Vegrow Library</h1>
      <AuthForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        fields={fields}
        buttonLabel="Login"
        message={message}
      />
    </>
  );
}