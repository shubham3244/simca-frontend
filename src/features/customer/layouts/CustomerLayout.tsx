import { Outlet } from 'react-router-dom';
import { CustomerTopbar } from '../components/CustomerTopbar';

export function CustomerLayout() {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      <CustomerTopbar />
      <main className="flex-1 overflow-y-auto bg-secondary px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
