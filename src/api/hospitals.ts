import type {
  HospitalFilterParams,
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

type GetHospitalCountOptions = HospitalFilterParams & {
  signal?: AbortSignal;
};

export function getHospitalCount({
  signal,
  ...params
}: GetHospitalCountOptions = {}) {
  return apiGet<number>('/api/hospitals/count', { params, signal });
}
