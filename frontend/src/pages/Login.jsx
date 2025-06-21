import { useState } from 'react';
import { login } from '../api';
import AuthForm from '../components/AuthForm';
import GoogleAuthButton from '../components/GoogleAuthButton';

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
        localStorage.setItem('role', data.role); // <-- This is required!
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
      <AuthForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        fields={fields}
        buttonLabel="Login"
        message={message}
      />
       <div className='google-auth'>
        <GoogleAuthButton  />
       </div>
        
    </>
  );
}