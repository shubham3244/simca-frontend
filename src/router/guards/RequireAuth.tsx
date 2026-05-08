import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../hooks/useAppStore';
import { FullPageSpinner } from '../../components/ui/FullPageSpinner';

export const REDIRECT_AFTER_LOGIN_KEY = 'simca-redirect-after-login';

interface RequireAuthProps {
  loginPath: string;
}

export function RequireAuth({ loginPath }: RequireAuthProps) {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const path = `${location.pathname}${location.search}`;
      // Skip noise paths so the redirect target is meaningful
      if (path !== '/' && !path.includes('/login')) {
        sessionStorage.setItem(REDIRECT_AFTER_LOGIN_KEY, path);
      }
    }
  }, [isLoading, isAuthenticated, location.pathname, location.search]);

  if (isLoading) {
    return <FullPageSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to={loginPath} replace state={{ from: location }} />;
  }

  return <Outlet />;
}
