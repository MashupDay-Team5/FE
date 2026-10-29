import { useCallback, useEffect, useState } from 'react';
import { getHospitalCount } from '@/api/hospitals';
import type { HospitalFilterParams } from '@/types/hospital';

const COUNT_REQUEST_DELAY = 300;

export type HospitalCountStatus = 'idle' | 'loading' | 'error' | 'success';

type HospitalCountEntry = {
  key: string | null;
  count: number | null;
  status: HospitalCountStatus;
  attempt: number;
};

function createEntry(key: string | null): HospitalCountEntry {
  return {
    key,
    count: null,
    status: key === null ? 'idle' : 'loading',
    attempt: 0,
  };
}

export function useHospitalCount(params: HospitalFilterParams | null) {
  const key = params === null ? null : JSON.stringify(params);
  const [entry, setEntry] = useState(() => createEntry(key));

  if (entry.key !== key) setEntry(createEntry(key));

  const { attempt } = entry;

  useEffect(() => {
    if (key === null) return;

    const controller = new AbortController();
    const requestParams: HospitalFilterParams = JSON.parse(key);
    const timeoutId = window.setTimeout(() => {
      getHospitalCount({ ...requestParams, signal: controller.signal })
        .then((count) => {
          if (controller.signal.aborted) return;
          setEntry((current) =>
            current.key !== key
              ? current
              : { ...current, count, status: 'success' },
          );
        })
        .catch(() => {
          if (controller.signal.aborted) return;
          setEntry((current) =>
            current.key !== key
              ? current
              : { ...current, count: null, status: 'error' },
          );
        });
    }, COUNT_REQUEST_DELAY);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [key, attempt]);

  const retry = useCallback(() => {
    setEntry((current) =>
      current.key !== key || current.status !== 'error'
        ? current
        : { ...current, status: 'loading', attempt: current.attempt + 1 },
    );
  }, [key]);

  return { count: entry.count, status: entry.status, retry };
}
