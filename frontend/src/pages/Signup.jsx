import { useState } from 'react';
import { signup } from '../api';
import AuthForm from '../components/AuthForm';

export default function Signup() {
  const [message, setMessage] = useState('');
  const initialValues = { role: 'member', email: '', password: '' };

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

  const handleSubmit = async (values) => {
    try {
      const data = await signup(values.role, values.email, values.password);
      if (values.role === 'librarian') {
        // Librarian: always show approval message, no token expected
        if (data.message) {
          setMessage('Signup successful! Await admin approval before you can login.');
        } else {
          setMessage(data.errors ? data.errors.join(', ') : 'Signup failed');
        }
      } else {
        // Member: expect token
        if (data.token) {
          setMessage(`Signup successful! Role: ${data.role}`);
          localStorage.setItem('token', data.token);
        } else {
          setMessage(data.errors ? data.errors.join(', ') : 'Signup failed');
        }
      }
    } catch {
      setMessage('Signup failed');
    }
  };

  return (
    <>
      <h1 style={{ textAlign: 'center', color: '#388e3c', marginTop: '2rem' }}>Vegrow Library</h1>
      <AuthForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        fields={fields}
        buttonLabel="Signup"
        message={message}
      />
    </>
  );
}