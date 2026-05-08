import { Outlet } from 'react-router-dom';
import { CallCenterSidebar } from '../components/CallCenterSidebar';
import { CallCenterTopbar } from '../components/CallCenterTopbar';

export function CallCenterLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <CallCenterSidebar />
      <div className="flex h-full min-w-0 flex-1 flex-col">
        <CallCenterTopbar />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
