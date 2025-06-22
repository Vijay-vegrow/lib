import { useState } from 'react';
import { login } from '../api';
import AuthForm from '../components/AuthForm';
import GoogleAuthButton from '../components/GoogleAuthButton';
import TimedMessage from '../components/TimedMessage';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [msgKey, setMsgKey] = useState(0);
  const { login: authLogin } = useAuth();

  const initialValues = { email, password };
  const fields = [
    { label: 'Email', name: 'email', type: 'email', required: true },
    { label: 'Password', name: 'password', type: 'password', required: true },
  ];

  const handleSubmit = async (values) => {
    try {
      const data = await login(values.email, values.password);
      if (data.token) {
        setMessage('Login successful! Redirecting...');
        setMsgKey(prev => prev + 1);
        authLogin(data.token, data.role);
        window.location.href = data.redirect_to;
      } else {
        setMessage(data.error || 'Login failed');
        setMsgKey(prev => prev + 1);
      }
    } catch {
      setMessage('Login failed');
      setMsgKey(prev => prev + 1);
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