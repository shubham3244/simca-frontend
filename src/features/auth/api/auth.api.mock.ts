import type {
  LoginRequest,
  LoginResponse,
  MeResponse,
} from './auth.api';
import type { Portal, User, UserRole } from '../store/auth.types';

const SESSION_KEY = 'simca-mock-session';

function delay(ms = 350) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const PORTAL_TO_DEFAULT_ROLE: Record<Portal, UserRole> = {
  CALL_CENTER: 'CALL_CENTER_AGENT',
  CUSTOMER: 'CUSTOMER',
  INSURER: 'INSURER',
  WORKSHOP: 'WORKSHOP',
  TECHNICIAN: 'TECHNICIAN',
};

function makeUser(role: UserRole, email: string): User {
  const namePart = email.split('@')[0] ?? 'User';
  return {
    id: `mock-user-${role.toLowerCase()}`,
    email,
    name: namePart
      .split(/[._-]/)
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(' '),
    role,
    tenantId: 'mock-tenant',
  };
}

export const authApiMock = {
  async login(payload: LoginRequest): Promise<LoginResponse> {
    await delay();

    const fieldErrors: Array<{ field: string; message: string }> = [];
    if (!payload.email.trim()) {
      fieldErrors.push({ field: 'email', message: 'Email is required' });
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
      fieldErrors.push({ field: 'email', message: 'Enter a valid email' });
    }
    if (!payload.password) {
      fieldErrors.push({ field: 'password', message: 'Password is required' });
    } else if (payload.password.length < 4) {
      // Mock-only: real backend should be stricter
      fieldErrors.push({
        field: 'password',
        message: 'Password must be at least 4 characters',
      });
    }
    if (fieldErrors.length > 0) {
      throw {
        statusCode: 422,
        code: 'VALIDATION_ERROR',
        message: 'Please fix the highlighted fields.',
        errors: fieldErrors,
      };
    }

    const role = PORTAL_TO_DEFAULT_ROLE[payload.portal];
    const user = makeUser(role, payload.email);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
    return { user };
  },

  async logout(): Promise<void> {
    await delay();
    sessionStorage.removeItem(SESSION_KEY);
  },

  async me(): Promise<MeResponse> {
    await delay(120);
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) {
      throw {
        statusCode: 401,
        code: 'UNAUTHENTICATED',
        message: 'No active session.',
      };
    }
    return { user: JSON.parse(raw) as User };
  },
};
