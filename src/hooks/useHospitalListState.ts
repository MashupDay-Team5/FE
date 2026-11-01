import { useCallback, useEffect, useState, type SetStateAction } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import { getDefaultHospitalListState } from '@/constants/hospitalList';
import type { HospitalListPage, HospitalListState } from '@/types/hospitalList';

const savedListStates = new Map<string, HospitalListState>();

function getRestoredState(
  page: HospitalListPage,
  sourceKey: string | undefined,
  fallback: HospitalListState,
) {
  const saved = sourceKey
    ? savedListStates.get(`${page}:${sourceKey}`)
    : undefined;
  return { ...(saved ?? fallback) };
}

export function useHospitalListState(page: HospitalListPage) {
  const location = useLocation();
  const navigationType = useNavigationType();
  const entryKey = `${page}:${location.key}`;
  const restoreKey =
    typeof location.state?.restoreListStateKey === 'string'
      ? location.state.restoreListStateKey
      : undefined;
  const sourceKey = navigationType === 'POP' ? location.key : restoreKey;
  const [entry, setEntry] = useState(() => ({
    key: entryKey,
    state: getRestoredState(page, sourceKey, getDefaultHospitalListState()),
  }));

  if (entry.key !== entryKey) {
    setEntry({
      key: entryKey,
      state: getRestoredState(
        page,
        sourceKey,
        navigationType === 'POP' ? getDefaultHospitalListState() : entry.state,
      ),
    });
  }

  useEffect(() => {
    savedListStates.set(entry.key, { ...entry.state });
  }, [entry]);

  const setListState = useCallback(
    (update: SetStateAction<HospitalListState>) => {
      setEntry((current) => ({
        key: entryKey,
        state: typeof update === 'function' ? update(current.state) : update,
      }));
    },
    [entryKey],
  );

  return { listState: entry.state, setListState, listEntryKey: location.key };
}
