export function focusSubscribeSection() {
  if (typeof document === "undefined") return;
  document.getElementById("subscribe")?.scrollIntoView({ behavior: "smooth" });
}
