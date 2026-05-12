import { Outlet } from 'react-router-dom';
import { WorkshopSidebar } from '../components/WorkshopSidebar';
import { WorkshopTopbar } from '../components/WorkshopTopbar';

export function WorkshopLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <WorkshopSidebar />
      <div className="flex h-full min-w-0 flex-1 flex-col">
        <WorkshopTopbar />
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-secondary p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
