import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, StudentProfile, UserRole } from '../types/user';

import { api } from '../utils/api';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  student: StudentProfile | null;
  loading: boolean;
  login: (identifier: string, password: string) => Promise<UserRole>;
  logout: () => void;
  getToken: () => string | null;
  refreshAccessToken: () => Promise<string | null>;
  isAdmin: () => boolean;
  isStudent: () => boolean;
  isLoggedIn: () => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if user is already logged in on page load
    const token = localStorage.getItem('access_token');
    const savedUser = localStorage.getItem('user');
    const savedRole = localStorage.getItem('role') as UserRole | null;
    const savedStudent = localStorage.getItem('student');

    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        setRole(savedRole);
        setStudent(savedStudent && savedStudent !== 'undefined' ? JSON.parse(savedStudent) : null);
      } catch (e) {
        console.error('Failed to parse auth data', e);
        logout(); // Clear corrupted data
      }
    }
    setLoading(false);
  }, []);

  const login = async (identifier: string, password: string): Promise<UserRole> => {
    const response = await api.post('/auth/login/', { identifier, password });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Login failed.');
    }

    const data = await response.json();

    // Save to localStorage
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('role', data.role);
    localStorage.setItem('student', JSON.stringify(data.student));

    // Update state
    setUser(data.user);
    setRole(data.role);
    setStudent(data.student);

    return data.role;
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    localStorage.removeItem('student');
    setUser(null);
    setRole(null);
    setStudent(null);
  };

  const refreshAccessToken = async (): Promise<string | null> => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) return null;

    try {
      const response = await api.post('/auth/refresh/', { refresh: refreshToken });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('access_token', data.access);
        return data.access;
      } else if (response.status === 401) {
        logout(); // Refresh token expired, force re-login
      }
    } catch (err) {
      console.error('Token refresh failed', err);
    }
    return null;
  };

  const getToken = () => localStorage.getItem('access_token');

  const isAdmin = () => role === 'ADMIN';
  const isStudent = () => role === 'STUDENT';
  const isLoggedIn = () => !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        student,
        loading,
        login,
        logout,
        getToken,
        refreshAccessToken,
        isAdmin,
        isStudent,
        isLoggedIn,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
