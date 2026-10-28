import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import { HospitalBookmarksContext } from '@/hooks/useHospitalBookmarks';

const BOOKMARKS_STORAGE_KEY = 'modoodoc:hospital-bookmarks';

function readBookmarkedHospitalIds(): ReadonlySet<number> {
  try {
    const stored: unknown = JSON.parse(
      localStorage.getItem(BOOKMARKS_STORAGE_KEY) ?? '[]',
    );

    if (!Array.isArray(stored)) return new Set();

    return new Set(
      stored.filter(
        (hospitalId): hospitalId is number =>
          typeof hospitalId === 'number' &&
          Number.isSafeInteger(hospitalId) &&
          hospitalId > 0,
      ),
    );
  } catch {
    return new Set();
  }
}

function HospitalBookmarksProvider({ children }: PropsWithChildren) {
  const [bookmarkedHospitalIds, setBookmarkedHospitalIds] = useState<
    ReadonlySet<number>
  >(readBookmarkedHospitalIds);

  useEffect(() => {
    try {
      localStorage.setItem(
        BOOKMARKS_STORAGE_KEY,
        JSON.stringify([...bookmarkedHospitalIds]),
      );
    } catch {
      return;
    }
  }, [bookmarkedHospitalIds]);

  const toggleBookmark = useCallback((hospitalId: number) => {
    setBookmarkedHospitalIds((previous) => {
      const next = new Set(previous);
      if (next.has(hospitalId)) {
        next.delete(hospitalId);
      } else {
        next.add(hospitalId);
      }
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ bookmarkedHospitalIds, toggleBookmark }),
    [bookmarkedHospitalIds, toggleBookmark],
  );

  return (
    <HospitalBookmarksContext value={value}>
      {children}
    </HospitalBookmarksContext>
  );
}

export default HospitalBookmarksProvider;
