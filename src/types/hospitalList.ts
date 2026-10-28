import type { HospitalSort } from '@/types/hospitalSearch';

export type HospitalListPage = 'home' | 'search';

export type HospitalListState = {
  sort: HospitalSort;
};
