import { createContext, useContext, useState, useCallback } from 'react';
import { api, getToken, setToken } from '../api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setTok] = useState(getToken());
  const [username, setUsername] = useState(null);

  const login = useCallback(async (uname, password) => {
    const data = await api.post('/auth/login', { username: uname, password });
    setToken(data.token);
    setTok(data.token);
    setUsername(data.username);
    return data;
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setTok(null);
    setUsername(null);
  }, []);

  return (
    <AuthContext.Provider value={{ token, username, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
