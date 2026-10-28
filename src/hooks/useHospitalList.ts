import { useCallback, useEffect, useState } from 'react';
import { getHospitals } from '@/api/hospitals';
import { DEFAULT_VISIBLE_HOSPITAL_COUNT } from '@/constants/hospitalList';
import type { HospitalListParams } from '@/types/hospital';
import type { HospitalSearchItem } from '@/types/hospitalSearch';
import { toHospitalSearchItem } from '@/utils/hospitalList';

export type HospitalListLoadStatus = 'idle' | 'loading' | 'error' | 'success';

type HospitalListEntry = {
  key: string | null;
  hospitals: HospitalSearchItem[];
  status: HospitalListLoadStatus;
  page: number;
  requestedPage: number;
  attempt: number;
  hasNext: boolean;
};

function createEntry(key: string | null): HospitalListEntry {
  return {
    key,
    hospitals: [],
    status: key === null ? 'idle' : 'loading',
    page: -1,
    requestedPage: 0,
    attempt: 0,
    hasNext: false,
  };
}

export function useHospitalList(params: HospitalListParams | null) {
  const key = params === null ? null : JSON.stringify(params);
  const [entry, setEntry] = useState(() => createEntry(key));

  if (entry.key !== key) setEntry(createEntry(key));

  const { requestedPage, attempt } = entry;

  useEffect(() => {
    if (key === null) return;

    const controller = new AbortController();
    const requestParams: HospitalListParams = JSON.parse(key);

    getHospitals({
      ...requestParams,
      page: requestedPage,
      size: DEFAULT_VISIBLE_HOSPITAL_COUNT,
      signal: controller.signal,
    })
      .then((response) => {
        if (controller.signal.aborted) return;
        const hospitals = response.content.map(toHospitalSearchItem);

        setEntry((current) =>
          current.key !== key
            ? current
            : {
                ...current,
                hospitals:
                  requestedPage === 0
                    ? hospitals
                    : [...current.hospitals, ...hospitals],
                page: response.page,
                hasNext: response.hasNext,
                status: 'success',
              },
        );
      })
      .catch(() => {
        if (controller.signal.aborted) return;
        setEntry((current) =>
          current.key !== key ? current : { ...current, status: 'error' },
        );
      });

    return () => controller.abort();
  }, [key, requestedPage, attempt]);

  const loadMore = useCallback(() => {
    setEntry((current) =>
      current.key !== key || current.status !== 'success' || !current.hasNext
        ? current
        : {
            ...current,
            requestedPage: current.page + 1,
            status: 'loading',
          },
    );
  }, [key]);

  const retry = useCallback(() => {
    setEntry((current) =>
      current.key !== key || current.status !== 'error'
        ? current
        : { ...current, status: 'loading', attempt: current.attempt + 1 },
    );
  }, [key]);

  return {
    hospitals: entry.hospitals,
    status: entry.status,
    hasNext: entry.hasNext,
    loadMore,
    retry,
  };
}
