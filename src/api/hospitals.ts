import type {
  HospitalListParams,
  HospitalListResponse,
} from '@/types/hospital';
import { apiGet } from './client';

type GetHospitalsOptions = HospitalListParams & {
  signal?: AbortSignal;
};

export function getHospitals({ signal, ...params }: GetHospitalsOptions = {}) {
  return apiGet<HospitalListResponse>('/api/hospitals', { params, signal });
}
