import type { HospitalListState } from '@/types/hospitalList';

export const DEFAULT_VISIBLE_HOSPITAL_COUNT = 8;

export function getDefaultHospitalListState(): HospitalListState {
  return { sort: 'most-visited' };
}
