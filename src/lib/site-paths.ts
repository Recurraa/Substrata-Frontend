export const paths = {
  home: "/",
  plans: "/plans",
  pay: (id: string) => `/pay/${id}`,
  onboarding: "/onboarding",
  dashboard: "/dashboard",
} as const;
