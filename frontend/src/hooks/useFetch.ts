import { useEffect, useRef, useState, useCallback } from 'react';

export type FetchStatus = 'loading' | 'success' | 'error';

export interface UseFetchResult<T> {
  data: T | null;
  status: FetchStatus;
  error: string | null;
  refetch: () => void;
}

/**
 * Generic async data hook shared by every public page. Guards against
 * setting state after unmount (or after a newer request has superseded
 * an older, slower one) using a request-id ref — prevents the classic
 * "stale response overwrites fresh one" race when filters change quickly
 * (e.g. fast typing in the catalog search box).
 */
export function useFetch<T>(fetcher: () => Promise<T>, deps: unknown[]): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [status, setStatus] = useState<FetchStatus>('loading');
  const [error, setError] = useState<string | null>(null);
  const requestId = useRef(0);

  const load = useCallback(() => {
    const currentRequest = ++requestId.current;
    setStatus('loading');
    setError(null);

    fetcher()
      .then((result) => {
        if (currentRequest !== requestId.current) return; // superseded
        setData(result);
        setStatus('success');
      })
      .catch((err) => {
        if (currentRequest !== requestId.current) return;
        setError(err?.response?.data?.message || err?.message || 'שגיאה בטעינת הנתונים');
        setStatus('error');
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [load]);

  return { data, status, error, refetch: load };
}
