import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import { getHospitals } from '@/api/hospitals';
import { DEFAULT_VISIBLE_HOSPITAL_COUNT } from '@/constants/hospitalList';
import type { HospitalListParams } from '@/types/hospital';
import type { HospitalListPage } from '@/types/hospitalList';
import type { HospitalSearchItem } from '@/types/hospitalSearch';
import { toHospitalSearchItem } from '@/utils/hospitalList';

export type HospitalListLoadStatus = 'idle' | 'loading' | 'error' | 'success';

type HospitalListEntry = {
  entryKey: string;
  restoreSourceKey: string | undefined;
  key: string | null;
  hospitals: HospitalSearchItem[];
  status: HospitalListLoadStatus;
  page: number;
  requestedPage: number | null;
  attempt: number;
  hasNext: boolean;
};

type HospitalListSnapshot = {
  key: string;
  hospitals: HospitalSearchItem[];
  page: number;
  hasNext: boolean;
};

const savedHospitalLists = new Map<string, HospitalListSnapshot>();

function createEntry(
  key: string | null,
  entryKey: string,
  restoreSourceKey: string | undefined,
): HospitalListEntry {
  const saved = restoreSourceKey
    ? savedHospitalLists.get(restoreSourceKey)
    : undefined;
  const restored = key !== null && saved?.key === key ? saved : undefined;

  return {
    entryKey,
    restoreSourceKey,
    key,
    hospitals: restored?.hospitals ?? [],
    status: restored ? 'success' : key === null ? 'idle' : 'loading',
    page: restored?.page ?? -1,
    requestedPage: restored ? null : 0,
    attempt: 0,
    hasNext: restored?.hasNext ?? false,
  };
}

export function useHospitalList(
  page: HospitalListPage,
  params: HospitalListParams | null,
) {
  const location = useLocation();
  const navigationType = useNavigationType();
  const entryKey = `${page}:${location.key}`;
  const key = params === null ? null : JSON.stringify(params);
  const [entry, setEntry] = useState(() =>
    createEntry(
      key,
      entryKey,
      navigationType === 'POP'
        ? entryKey
        : typeof location.state?.restoreListStateKey === 'string'
          ? `${page}:${location.state.restoreListStateKey}`
          : undefined,
    ),
  );

  if (entry.entryKey !== entryKey || entry.key !== key) {
    setEntry(
      createEntry(
        key,
        entryKey,
        entry.entryKey === entryKey
          ? entry.restoreSourceKey
          : navigationType === 'POP'
            ? entryKey
            : undefined,
      ),
    );
  }

  const { requestedPage, attempt } = entry;

  useEffect(() => {
    if (entry.key !== null && entry.page >= 0) {
      savedHospitalLists.set(entry.entryKey, {
        key: entry.key,
        hospitals: entry.hospitals,
        page: entry.page,
        hasNext: entry.hasNext,
      });
    }
  }, [entry]);

  useEffect(() => {
    if (key === null || requestedPage === null) return;

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
          current.key !== key || current.entryKey !== entryKey
            ? current
            : {
                ...current,
                hospitals:
                  requestedPage === 0
                    ? hospitals
                    : [...current.hospitals, ...hospitals],
                page: response.page,
                requestedPage: null,
                hasNext: response.hasNext,
                status: 'success',
              },
        );
      })
      .catch(() => {
        if (controller.signal.aborted) return;
        setEntry((current) =>
          current.key !== key || current.entryKey !== entryKey
            ? current
            : { ...current, status: 'error' },
        );
      });

    return () => controller.abort();
  }, [key, entryKey, requestedPage, attempt]);

  const loadMore = useCallback(() => {
    setEntry((current) =>
      current.key !== key ||
      current.entryKey !== entryKey ||
      current.status !== 'success' ||
      !current.hasNext
        ? current
        : {
            ...current,
            requestedPage: current.page + 1,
            status: 'loading',
          },
    );
  }, [key, entryKey]);

  const retry = useCallback(() => {
    setEntry((current) =>
      current.key !== key ||
      current.entryKey !== entryKey ||
      current.status !== 'error'
        ? current
        : { ...current, status: 'loading', attempt: current.attempt + 1 },
    );
  }, [key, entryKey]);

  return {
    hospitals: entry.hospitals,
    status: entry.status,
    hasNext: entry.hasNext,
    loadMore,
    retry,
  };
}
