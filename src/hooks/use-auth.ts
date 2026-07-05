"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { authApi } from "@/lib/api/auth";
import type {
  LoginInput,
  RegisterInput,
  SocialProvider,
  UpdateProfileInput,
} from "@/lib/api/types";
import {
  getRefreshToken,
  useAuthStore,
} from "@/lib/store/auth-store";

import { queryKeys } from "./query-keys";

/** Current authenticated user profile (only fetched when logged in). */
export function useProfile() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: queryKeys.auth.profile,
    queryFn: authApi.getProfile,
    enabled: isAuthenticated,
  });
}

/** Email/password login: stores tokens then fetches the profile. */
export function useLogin() {
  const queryClient = useQueryClient();
  const setTokens = useAuthStore((s) => s.setTokens);
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: (input: LoginInput) => authApi.login(input),
    onSuccess: async (tokens) => {
      setTokens(tokens);
      const user = await authApi.getProfile();
      setUser(user);
      queryClient.setQueryData(queryKeys.auth.profile, user);
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (input: RegisterInput) => authApi.register(input),
  });
}

/**
 * Social login (Google/GitHub): exchanges the OAuth `code` for JWT tokens,
 * then fetches the profile — same post-login flow as `useLogin`.
 */
export function useSocialLogin() {
  const queryClient = useQueryClient();
  const setTokens = useAuthStore((s) => s.setTokens);
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: ({
      provider,
      code,
    }: {
      provider: SocialProvider;
      code: string;
    }) => authApi.socialLogin(provider, code),
    onSuccess: async (tokens) => {
      setTokens(tokens);
      const user = await authApi.getProfile();
      setUser(user);
      queryClient.setQueryData(queryKeys.auth.profile, user);
    },
  });
}

/** PATCH /users/profile/ then sync the store + profile cache. */
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: (input: UpdateProfileInput) => authApi.updateProfile(input),
    onSuccess: (user) => {
      setUser(user);
      queryClient.setQueryData(queryKeys.auth.profile, user);
    },
  });
}

/** POST /users/password/change/ (authenticated). */
export function useChangePassword() {
  return useMutation({
    mutationFn: (data: {
      old_password: string;
      new_password1: string;
      new_password2: string;
    }) => authApi.changePassword(data),
  });
}

/** POST /users/password/reset/ — sends the reset email. */
export function useRequestPasswordReset() {
  return useMutation({
    mutationFn: (email: string) => authApi.requestPasswordReset(email),
  });
}

/** POST /users/password/reset/confirm/ — sets a new password from the emailed link. */
export function useConfirmPasswordReset() {
  return useMutation({
    mutationFn: (data: {
      uid: string;
      token: string;
      new_password1: string;
      new_password2: string;
    }) => authApi.confirmPasswordReset(data),
  });
}

/** Logout: best-effort server blacklist, then clear local state and cache. */
export function useLogout() {
  const queryClient = useQueryClient();
  const logout = useAuthStore((s) => s.logout);

  return useMutation({
    mutationFn: async () => {
      const refresh = getRefreshToken();
      if (refresh) {
        try {
          await authApi.logout(refresh);
        } catch {
          // Ignore server errors; we still clear local state below.
        }
      }
    },
    onSettled: () => {
      logout();
      queryClient.clear();
    },
  });
}
