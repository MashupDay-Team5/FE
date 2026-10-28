import { useCallback, useMemo, useState, type PropsWithChildren } from 'react';
import { HospitalBookmarksContext } from '@/hooks/useHospitalBookmarks';

function HospitalBookmarksProvider({ children }: PropsWithChildren) {
  const [bookmarkedHospitalIds, setBookmarkedHospitalIds] = useState<
    ReadonlySet<number>
  >(() => new Set());

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
