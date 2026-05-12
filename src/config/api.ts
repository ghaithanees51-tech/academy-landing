/**
 * API base URL from `VITE_API_URL` (no trailing slash).
 * Falls back to the current origin and then the local Django server in dev.
 */
export function getApiBaseUrl(): string {
  const raw = typeof import.meta !== "undefined" ? import.meta.env.VITE_API_URL : undefined;
  const env = typeof raw === "string" ? raw.trim() : "";
  if (env) return env.replace(/\/+$/, "");
  return "http://127.0.0.1:8000";
}

export const API_BASE_URL = getApiBaseUrl();
