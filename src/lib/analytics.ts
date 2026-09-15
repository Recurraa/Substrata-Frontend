/** Lightweight analytics helpers (no third-party SDK required). */
export type AnalyticsEvent =
  | "pay_view"
  | "pay_subscribe_click"
  | "plans_view"
  | "csv_export";

export function track(event: AnalyticsEvent, props?: Record<string, string | number>) {
  if (typeof window === "undefined") return;
  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.debug("[analytics]", event, props ?? {});
  }
  window.dispatchEvent(new CustomEvent("sorobill:analytics", { detail: { event, props } }));
}
