import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { TagNetworkBrand } from '../../../components/ui/TagNetworkBrand';
import { useAppDispatch } from '../../../hooks/useAppStore';
import { roleHomePath } from '../../../lib/permissions/roleHomePath';
import { REDIRECT_AFTER_LOGIN_KEY } from '../../../router/guards/RequireAuth';
import type { ApiErrorResponse } from '../../../types/api.types';
import { loginThunk } from '../store/auth.slice';
import type { Portal } from '../store/auth.types';

interface LoginShellProps {
  portal: Portal;
  portalLabel: string;
  portalTagline: string;
  /** Optional path prefix to scope the saved redirect (so a Customer login
   *  doesn't bounce a Call Center deep link). */
  portalPathPrefix?: string;
  forgotPasswordPath?: string;
}

interface LoginFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

const dotPatternStyle = {
  backgroundImage:
    'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
  backgroundSize: '24px 24px',
};

export function LoginShell({
  portal,
  portalLabel,
  portalTagline,
  portalPathPrefix,
  forgotPasswordPath,
}: LoginShellProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  useEffect(() => {
    setFocus('email');
  }, [setFocus]);

  const onSubmit = async (values: LoginFormValues) => {
    setFormError(null);
    try {
      const user = await dispatch(
        loginThunk({
          email: values.email,
          password: values.password,
          portal,
          rememberMe: values.rememberMe,
        }),
      ).unwrap();

      const intended = sessionStorage.getItem(REDIRECT_AFTER_LOGIN_KEY);
      sessionStorage.removeItem(REDIRECT_AFTER_LOGIN_KEY);

      const fallback = roleHomePath(user.role);
      const target =
        intended && portalPathPrefix && intended.startsWith(portalPathPrefix)
          ? intended
          : fallback;

      navigate(target, { replace: true });
    } catch (rejected) {
      const err = rejected as ApiErrorResponse | undefined;

      if (err?.errors?.length) {
        for (const fieldErr of err.errors) {
          if (fieldErr.field === 'email' || fieldErr.field === 'password') {
            setError(fieldErr.field, { message: fieldErr.message });
          }
        }
      }

      setFormError(
        err?.statusCode === 401
          ? 'Invalid email or password.'
          : err?.message ?? 'Unable to sign in. Please try again.',
      );
    }
  };

  const year = new Date().getFullYear();

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      {/* Brand panel — hidden on mobile */}
      <aside
        className="hidden bg-primary text-primary-foreground md:flex md:flex-col md:justify-between md:p-12"
        style={dotPatternStyle}
      >
        <div>
          <TagNetworkBrand size="md" />
        </div>

        <div className="max-w-md">
          <h2 className="text-3xl font-bold leading-tight">
            Windshield Claims Platform
          </h2>
          <p className="mt-4 text-base leading-relaxed text-primary-foreground/75">
            {portalTagline}
          </p>
        </div>

        <p className="text-xs text-primary-foreground/60">
          © {year} TAG Network. Internal use only.
        </p>
      </aside>

      {/* Form panel */}
      <main className="flex items-center justify-center bg-background px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile-only brand at top */}
          <div className="mb-8 flex justify-center md:hidden">
            <TagNetworkBrand size="md" />
          </div>

          <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in to {portalLabel}
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-8 flex flex-col gap-4"
            noValidate
          >
            <Input
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              required
              error={errors.email?.message}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Enter a valid email address',
                },
              })}
            />

            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Enter your password"
              required
              error={errors.password?.message}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                  className="pointer-events-auto text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              }
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 4, message: 'Minimum 4 characters' },
              })}
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex cursor-pointer select-none items-center gap-2 text-foreground">
                <input
                  type="checkbox"
                  className="size-4 rounded border-border text-primary focus:ring-2 focus:ring-ring/30"
                  {...register('rememberMe')}
                />
                Remember me
              </label>

              {forgotPasswordPath && (
                <a
                  href={forgotPasswordPath}
                  className="font-medium text-primary hover:underline"
                >
                  Forgot password?
                </a>
              )}
            </div>

            {formError && (
              <div
                role="alert"
                className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive"
              >
                {formError}
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              isLoading={isSubmitting}
              className="mt-2 w-full"
            >
              Sign in
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
