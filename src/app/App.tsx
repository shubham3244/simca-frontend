import { RouterProvider } from 'react-router-dom';
import { ConfirmProvider } from '../components/ui/ConfirmDialog';
import { useSessionBootstrap } from '../features/auth/hooks/useSessionBootstrap';
import { router } from '../router';

function App() {
  useSessionBootstrap();
  return (
    <ConfirmProvider>
      <RouterProvider router={router} />
    </ConfirmProvider>
  );
}

export default App;
