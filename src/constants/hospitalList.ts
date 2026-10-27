import type { HospitalListPage, HospitalListState } from '@/types/hospitalList';

export const DEFAULT_VISIBLE_HOSPITAL_COUNT = 8;

export function getDefaultHospitalListState(
  page: HospitalListPage,
): HospitalListState {
  return page === 'home'
    ? {
        sort: 'most-visited',
        visibleHospitalCount: DEFAULT_VISIBLE_HOSPITAL_COUNT,
      }
    : { sort: 'most-visited' };
}
