import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);
const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('vigilo_token'));
  const [loading, setLoading] = useState(true);

  // Set axios default Authorization header
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Validate token on mount
  useEffect(() => {
    if (!token) { setLoading(false); return; }
    axios.get(`${API}/api/auth/me`)
      .then(res => setUser(res.data.user))
      .catch(() => { localStorage.removeItem('vigilo_token'); setToken(null); setUser(null); })
      .finally(() => setLoading(false));
  }, []);

  async function login(operator_id, password) {
    const res = await axios.post(`${API}/api/auth/login`, { operator_id, password });
    const { token: t, user: u } = res.data;
    localStorage.setItem('vigilo_token', t);
    setToken(t);
    setUser(u);
    return u;
  }

  async function switchDemoRole(roleKey) {
    const creds = {
      admin: { operator_id: 'ADMIN-001', password: 'admin123' },
      centre_head: { operator_id: 'TC-BLR-01', password: 'centre123' },
      auditor: { operator_id: 'AUDIT-99', password: 'auditor123' },
    };
    const c = creds[roleKey] || creds.admin;
    return login(c.operator_id, c.password);
  }

  function logout() {
    localStorage.removeItem('vigilo_token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  }

  return (
    <AuthContext.Provider value={{ user, token, login, switchDemoRole, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
