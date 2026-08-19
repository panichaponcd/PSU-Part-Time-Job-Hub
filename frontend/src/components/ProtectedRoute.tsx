import { JSX } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: JSX.Element;
}

// Requires login
export function RequireAuth({ children }: ProtectedRouteProps) {
  const { isLoggedIn } = useAuth();
  if (!isLoggedIn()) return <Navigate to="/signin" replace />;
  return children;
}

// Requires admin role
export function RequireAdmin({ children }: ProtectedRouteProps) {
  const { isLoggedIn, isAdmin } = useAuth();
  if (!isLoggedIn()) return <Navigate to="/signin" replace />;
  if (!isAdmin()) return <Navigate to="/" replace />;
  return children;
}

// Redirect logged in users away from signin page
export function RedirectIfLoggedIn({ children }: ProtectedRouteProps) {
  const { isLoggedIn, isAdmin } = useAuth();
  if (isLoggedIn()) {
    return <Navigate to={isAdmin() ? '/admin/dashboard' : '/'} replace />;
  }
  return children;
}
