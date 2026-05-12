import type { ReactNode } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, type MemoryRouterProps } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { ConfirmProvider } from './components/ui/ConfirmDialog';
import { authReducer } from './features/auth/store/auth.slice';

interface AppProvidersOptions {
  initialEntries?: MemoryRouterProps['initialEntries'];
}

/**
 * Test render helper that wraps a component with all top-level providers:
 * - Redux store (auth slice)
 * - MemoryRouter for routing-aware components
 * - ConfirmProvider for useConfirm()
 *
 * Use for any component test that pulls in routing, redux, or confirms.
 */
export function renderWithProviders(
  ui: ReactNode,
  { initialEntries = ['/'], ...renderOptions }: AppProvidersOptions & RenderOptions = {},
) {
  const store = configureStore({
    reducer: { auth: authReducer },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={initialEntries}>
        <ConfirmProvider>{ui}</ConfirmProvider>
      </MemoryRouter>
    </Provider>,
    renderOptions,
  );
}
