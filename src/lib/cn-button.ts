import { cn } from "@/lib/utils";

export function ctaClassName(extra?: string) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-md bg-teal-500 px-4 py-2 font-medium text-slate-950 transition hover:bg-teal-400",
    extra
  );
}
