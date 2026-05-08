import { Navigate, Outlet } from 'react-router-dom';
import { FullPageSpinner } from '../../components/ui/FullPageSpinner';
import { useAppSelector } from '../../hooks/useAppStore';
import { roleHomePath } from '../../lib/permissions/roleHomePath';
import type { UserRole } from '../../features/auth/store/auth.types';

interface RequireRoleProps {
  allowed: UserRole[];
}

export function RequireRole({ allowed }: RequireRoleProps) {
  const { user, isLoading } = useAppSelector((s) => s.auth);

  if (isLoading) {
    return <FullPageSpinner />;
  }
  if (!user) {
    return <Navigate to="/" replace />;
  }
  if (!allowed.includes(user.role)) {
    return <Navigate to={roleHomePath(user.role)} replace />;
  }
  return <Outlet />;
}
