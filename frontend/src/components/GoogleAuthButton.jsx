import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { googleOAuthLogin } from '../api';

export default function GoogleAuthButton() {
  const buttonDiv = useRef(null);
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState('');

  useEffect(() => {
    // Ensure the Google script is loaded
    if (window.google && window.google.accounts && buttonDiv.current) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_OAUTH2_CLIENT_ID,
        callback: async (response) => {
          try {
            // Send the credential (JWT) to your backend for verification
            const data = await googleOAuthLogin(response.credential);
            if (data.token && data.role) {
              login(data.token, data.role);
              if (data.role === 'admin') navigate('/admin/panel');
              else if (data.role === 'librarian') navigate('/librarian/dashboard');
              else navigate('/books');
            } else if (data.email) {
              navigate(`/role-select?email=${encodeURIComponent(data.email)}`);
            } else {
              setError(data.error || 'Google login failed');
            }
          } catch (err) {
            setError('Google login failed');
          }
        }
      });
      window.google.accounts.id.renderButton(buttonDiv.current, {
        theme: 'outline',
        size: 'large',
        width: 260,
      });
      // Optionally show the One Tap dialog
      // window.google.accounts.id.prompt();
    }
  }, [login, navigate]);

  return (
    <>
      <div ref={buttonDiv}></div>
      {error && (
        <div style={{ color: 'red', marginTop: 8, fontWeight: 600 }}>
          {error}
        </div>
      )}
    </>
  );
}