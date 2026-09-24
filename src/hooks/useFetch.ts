import { useCallback, useEffect, useState } from "react";
import api from "../services/api";

interface UseFetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useFetch<T>(url: string | null) {
  const [state, setState] = useState<UseFetchState<T>>({
    data: null,
    loading: !!url,
    error: null,
  });
  const [refetchIndex, setRefetchIndex] = useState(0);

  const refetch = useCallback(() => setRefetchIndex((n) => n + 1), []);

  useEffect(() => {
    if (!url) {
      setState({ data: null, loading: false, error: null });
      return;
    }

    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: null }));

    api
      .get<T>(url)
      .then((res) => {
        if (!cancelled) setState({ data: res.data, loading: false, error: null });
      })
      .catch((err) => {
        if (cancelled) return;
        const apiErr = err as { apiError?: { message?: string } };
        setState({
          data: null,
          loading: false,
          error: apiErr.apiError?.message || "Failed to load data.",
        });
      });

    return () => {
      cancelled = true;
    };
  }, [url, refetchIndex]);

  return { ...state, refetch };
}
