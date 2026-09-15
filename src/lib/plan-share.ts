import { env } from "@/lib/env";

export function planPayUrl(planId: string): string {
  const base = env.app.url.replace(/\/$/, "");
  return `${base}/pay/${planId}`;
}

export function publicPlansUrl(): string {
  return `${env.app.url.replace(/\/$/, "")}/plans`;
}
