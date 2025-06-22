import { useState } from 'react';
import { signup } from '../api';
import AuthForm from '../components/AuthForm';
import GoogleAuthButton from '../components/GoogleAuthButton';
import TimedMessage from '../components/TimedMessage';

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
      if (data.errors) {
        setMessage(data.errors.join(', '));
      } else if (values.role === 'librarian') {
        setMessage('Signup successful! Await admin approval before you can login.');
      } else {
        setMessage('Signup successful! You can now log in.');
      }
    } catch {
      setMessage('Signup failed');
    }
  };

  return (
    <>
      <TimedMessage message={message} onClose={() => setMessage('')} />
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