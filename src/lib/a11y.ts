/** Shared accessibility helpers for checkout flows. */
export function announce(message: string) {
  if (typeof document === "undefined") return;
  let el = document.getElementById("sorobill-live");
  if (!el) {
    el = document.createElement("div");
    el.id = "sorobill-live";
    el.setAttribute("role", "status");
    el.setAttribute("aria-live", "polite");
    el.className = "sr-only";
    document.body.appendChild(el);
  }
  el.textContent = message;
}
