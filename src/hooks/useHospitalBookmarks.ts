import { createContext, useContext } from 'react';

type HospitalBookmarksContextValue = {
  bookmarkedHospitalIds: ReadonlySet<number>;
  toggleBookmark: (hospitalId: number) => void;
};

export const HospitalBookmarksContext = createContext<
  HospitalBookmarksContextValue | undefined
>(undefined);

export function useHospitalBookmarks() {
  const context = useContext(HospitalBookmarksContext);

  if (!context) {
    throw new Error(
      'useHospitalBookmarks는 HospitalBookmarksProvider 안에서 사용해야 합니다.',
    );
  }

  return context;
}
