import type {
  AuthTokens,
  LoginInput,
  RegisterInput,
  SocialProvider,
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

  /**
   * POST /users/google/ | /users/github/ — exchanges the OAuth `code` returned by
   * the provider for our own JWT access/refresh tokens.
   */
  socialLogin: (provider: SocialProvider, code: string) =>
    request<AuthTokens>({
      method: "POST",
      url: `/users/${provider}/`,
      data: { code },
    }),

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

  /**
   * PATCH /users/profile/.
   * When `profile_picture` is a `File`, sends multipart/form-data; otherwise sends
   * a plain JSON PATCH (backwards compatible with name-only updates).
   */
  updateProfile: (input: UpdateProfileInput) => {
    if (input.profile_picture instanceof File) {
      const form = new FormData();
      if (input.first_name !== undefined) {
        form.append("first_name", input.first_name);
      }
      if (input.last_name !== undefined) {
        form.append("last_name", input.last_name);
      }
      form.append("profile_picture", input.profile_picture);
      return request<User>({
        method: "PATCH",
        url: "/users/profile/",
        data: form,
        // Let axios set the multipart boundary automatically for the FormData.
        headers: { "Content-Type": "multipart/form-data" },
      });
    }

    return request<User>({ method: "PATCH", url: "/users/profile/", data: input });
  },

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
