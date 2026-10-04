import { JSX } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: JSX.Element;
}

// Requires login
export function RequireAuth({ children }: ProtectedRouteProps) {
  const { isLoggedIn } = useAuth();
  const location = useLocation();
  if (!isLoggedIn()) return <Navigate to="/signin" state={location.state} replace />;
  return children;
}

// Requires admin role
export function RequireAdmin({ children }: ProtectedRouteProps) {
  const { isLoggedIn, isAdmin } = useAuth();
  const location = useLocation();
  if (!isLoggedIn()) return <Navigate to="/signin" state={location.state} replace />;
  if (!isAdmin()) return <Navigate to="/jobs" replace />;
  return children;
}

// Redirect logged in users away from signin page
export function RedirectIfLoggedIn({ children }: ProtectedRouteProps) {
  const { isLoggedIn, isAdmin } = useAuth();
  if (isLoggedIn()) {
    return <Navigate to={isAdmin() ? '/admin/dashboard' : '/jobs'} replace />;
  }
  return children;
}
