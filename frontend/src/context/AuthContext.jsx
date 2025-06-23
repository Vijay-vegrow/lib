import { createContext, useContext, useState, useEffect } from 'react';
import { apiLogout } from '../api'; // Add this import

let tokenGetter = () => null;
let roleGetter = () => null;

export function setTokenGetter(fn) {
  tokenGetter = fn;
}
export function getToken() {
  return tokenGetter();
}
export function setRoleGetter(fn) {
  roleGetter = fn;
}
export function getRole() {
  return roleGetter();
}

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [role, setRole] = useState(localStorage.getItem('role'));

  useEffect(() => {
    const handler = () => {
      setToken(localStorage.getItem('token'));
      setRole(localStorage.getItem('role'));
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  useEffect(() => {
    setTokenGetter(() => token);
    setRoleGetter(() => role);
  }, [token, role]);

  const login = (token, role) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    setToken(token);
    setRole(role);
  };

  const logout = async () => {
    try {
      await apiLogout(); // Call backend to blacklist token
    } catch (e) {
      // Optionally handle error (e.g., network error)
    }
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setToken(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}