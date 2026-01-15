/**
 * Authentication utilities for the frontend.
 * Uses simple token-based auth with localStorage.
 */

import { api, setToken, clearToken, getToken, isAuthenticated } from "./api";
import type { TokenResponse, UserCreate, UserLogin, User } from "./types";

/**
 * Sign up a new user.
 */
export async function signUp(data: UserCreate): Promise<{ user?: User; error?: string }> {
  const response = await api.post<User>("/api/auth/signup", data);

  if (response.error) {
    return { error: response.error.detail };
  }

  return { user: response.data };
}

/**
 * Sign in an existing user.
 */
export async function signIn(data: UserLogin): Promise<{ success: boolean; error?: string }> {
  const response = await api.post<TokenResponse>("/api/auth/signin", data);

  if (response.error) {
    return { success: false, error: response.error.detail };
  }

  if (response.data?.access_token) {
    setToken(response.data.access_token);
    return { success: true };
  }

  return { success: false, error: "No token received" };
}

/**
 * Sign out the current user.
 */
export async function signOut(): Promise<void> {
  // Call backend signout endpoint (optional, for logging purposes)
  const token = getToken();
  if (token) {
    await api.post("/api/auth/signout", {});
  }

  // Clear local token
  clearToken();

  // Redirect to login
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}

/**
 * Check if the user is currently authenticated.
 */
export function checkAuth(): boolean {
  return isAuthenticated();
}

/**
 * Get the current authentication token.
 */
export function getAuthToken(): string | null {
  return getToken();
}
