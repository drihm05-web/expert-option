import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchApi } from './api';

interface User {
  id: string;
  email: string;
  name?: string;
  role: 'client' | 'admin';
}

interface AuthContextType {
  user: User | null;
  role: 'client' | 'admin' | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  role: null, 
  loading: true,
  login: () => {},
  logout: () => {}
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<'client' | 'admin' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const { user } = await fetchApi('/auth/me');
        setUser(user);
        setRole(user.role);
      } catch (err) {
        console.error("Auth init error:", err);
        localStorage.removeItem('auth_token');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = (token: string, userData: User) => {
    localStorage.setItem('auth_token', token);
    setUser(userData);
    setRole(userData.role);
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
