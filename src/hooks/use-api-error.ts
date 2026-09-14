"use client";

import { useState, useCallback } from "react";

export function useApiError() {
  const [error, setError] = useState<string | null>(null);

  const capture = useCallback((err: unknown) => {
    setError(err instanceof Error ? err.message : String(err));
  }, []);

  const clear = useCallback(() => setError(null), []);

  return { error, capture, clear, setError };
}
