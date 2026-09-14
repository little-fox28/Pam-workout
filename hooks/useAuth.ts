/**
 * Pam App — useAuth hook
 * Wraps the auth store + auth navigation side-effects.
 */
import { useCallback } from 'react';

import { useRouter } from 'expo-router';

import { ROUTES } from '@constants/index';
import { useAuthStore } from '@store/useAuthStore';
import type { LoginCredentials, RegisterCredentials } from '@types/index';

export const useAuth = () => {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, error, login, register, logout, clearError } =
    useAuthStore();

  const handleLogin = useCallback(
    async (credentials: LoginCredentials) => {
      await login(credentials);
      router.replace(ROUTES.TABS.HOME as never);
    },
    [login, router]
  );

  const handleRegister = useCallback(
    async (credentials: RegisterCredentials) => {
      await register(credentials);
      router.replace(ROUTES.TABS.HOME as never);
    },
    [register, router]
  );

  const handleLogout = useCallback(async () => {
    await logout();
    router.replace(ROUTES.AUTH.LOGIN as never);
  }, [logout, router]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    clearError,
  };
};
