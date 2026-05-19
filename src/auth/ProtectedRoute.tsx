import { Navigate, Outlet } from 'react-router-dom';
import { getSession } from './session';

export function ProtectedRoute() {
  const session = getSession();
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
