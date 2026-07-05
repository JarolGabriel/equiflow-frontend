import type {
  AuthTokens,
  LoginInput,
  RegisterInput,
  UpdateProfileInput,
  User,
} from "@/lib/api/types";

import { request } from "./client";

export const authApi = {
  /** POST /users/register/ */
  register: (input: RegisterInput) =>
    request<User>({ method: "POST", url: "/users/register/", data: input }),

  /** POST /users/login/ -> access + refresh tokens. */
  login: (input: LoginInput) =>
    request<AuthTokens>({ method: "POST", url: "/users/login/", data: input }),

  /** POST /users/login/refresh/ */
  refresh: (refresh: string) =>
    request<{ access: string; refresh?: string }>({
      method: "POST",
      url: "/users/login/refresh/",
      data: { refresh },
    }),

  /** POST /users/logout/ (blacklists the refresh token server-side). */
  logout: (refresh: string) =>
    request<void>({ method: "POST", url: "/users/logout/", data: { refresh } }),

  /** GET /users/profile/ */
  getProfile: () => request<User>({ method: "GET", url: "/users/profile/" }),

  /** PATCH /users/profile/ */
  updateProfile: (input: UpdateProfileInput) =>
    request<User>({ method: "PATCH", url: "/users/profile/", data: input }),

  /** POST /users/password/change/ */
  changePassword: (data: {
    old_password: string;
    new_password1: string;
    new_password2: string;
  }) =>
    request<{ detail: string }>({
      method: "POST",
      url: "/users/password/change/",
      data,
    }),

  /** POST /users/password/reset/ */
  requestPasswordReset: (email: string) =>
    request<{ detail: string }>({
      method: "POST",
      url: "/users/password/reset/",
      data: { email },
    }),

  /** POST /users/password/reset/confirm/ */
  confirmPasswordReset: (data: {
    uid: string;
    token: string;
    new_password1: string;
    new_password2: string;
  }) =>
    request<{ detail: string }>({
      method: "POST",
      url: "/users/password/reset/confirm/",
      data,
    }),
};
