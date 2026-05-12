import { Outlet } from 'react-router-dom';
import { InsurerTopbar } from '../components/InsurerTopbar';

export function InsurerLayout() {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      <InsurerTopbar />
      <main className="flex-1 overflow-y-auto bg-secondary px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
