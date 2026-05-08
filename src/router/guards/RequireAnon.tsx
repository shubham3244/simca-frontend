import { Navigate, Outlet } from 'react-router-dom';
import { FullPageSpinner } from '../../components/ui/FullPageSpinner';
import { useAppSelector } from '../../hooks/useAppStore';
import { roleHomePath } from '../../lib/permissions/roleHomePath';

export function RequireAnon() {
  const { user, isAuthenticated, isLoading } = useAppSelector((s) => s.auth);

  if (isLoading) {
    return <FullPageSpinner />;
  }

  if (isAuthenticated && user) {
    return <Navigate to={roleHomePath(user.role)} replace />;
  }

  return <Outlet />;
}
