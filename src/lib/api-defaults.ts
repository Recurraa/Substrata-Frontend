import { env } from "@/lib/env";

/** Prefer live API unless mock is explicitly enabled. */
export function useLiveApi(): boolean {
  return !env.app.useMock;
}

export function apiBase(): string {
  return env.app.apiUrl.replace(/\/$/, "");
}
