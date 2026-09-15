export function assertPlanId(id: string): string {
  const trimmed = id.trim();
  if (!trimmed) throw new Error("Missing plan id");
  return trimmed;
}
