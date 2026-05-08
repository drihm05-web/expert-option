import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

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
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  role: null, 
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {}
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<'client' | 'admin' | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async (token: string) => {
    try {
      const response = await fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setRole(data.user.role);
      } else {
        localStorage.removeItem('token');
        setUser(null);
        setRole(null);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setUser(null);
      setRole(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting login for:', email);
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const contentType = res.headers.get('content-type');
      let data;
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      } else {
        const text = await res.text();
        console.error('Expected JSON but received:', text.substring(0, 100));
        throw new Error(`Server returned non-JSON response: ${text.substring(0, 50)}...`);
      }

      if (!res.ok) throw new Error(data.details || data.error || 'Failed to sign in');
      
      localStorage.setItem('token', data.token);
      setUser(data.user);
      setRole(data.user.role);
      toast.success('Successfully signed in');
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(`Login Error: ${error.message}`);
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      console.log('Attempting registration for:', email);
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
      });

      const contentType = res.headers.get('content-type');
      let data;
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      } else {
        const text = await res.text();
        console.error('Expected JSON but received:', text.substring(0, 100));
        throw new Error(`Server returned non-JSON response: ${text.substring(0, 50)}...`);
      }

      if (!res.ok) throw new Error(data.details || data.error || 'Failed to register');
      
      localStorage.setItem('token', data.token);
      setUser(data.user);
      setRole(data.user.role);
      toast.success('Successfully registered');
    } catch (error: any) {
      console.error("Register error:", error);
      toast.error(`Registration Error: ${error.message}`);
      throw error;
    }
  };

  const logout = async () => {
    localStorage.removeItem('token');
    setUser(null);
    setRole(null);
    toast.success('Signed out');
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
