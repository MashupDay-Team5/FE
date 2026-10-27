import type {
  HospitalDetailResponse,
  ReviewKeywordResponse,
  ReviewListResponse,
  ReviewScopeRequest,
  ReviewSortRequest,
} from '@/types/hospitalDetail';
import { apiGet } from './client';

type HospitalTreatmentParams = {
  hospitalId: number;
  treatmentId: number;
  signal?: AbortSignal;
};

type GetHospitalReviewsParams = HospitalTreatmentParams & {
  scope: ReviewScopeRequest;
  sort: ReviewSortRequest;
  page: number;
  size: number;
};

function getHospitalTreatmentPath(hospitalId: number, treatmentId: number) {
  return `/api/hospitals/${hospitalId}/treatments/${treatmentId}`;
}

export function getHospitalDetail({
  hospitalId,
  treatmentId,
  signal,
}: HospitalTreatmentParams) {
  return apiGet<HospitalDetailResponse>(
    getHospitalTreatmentPath(hospitalId, treatmentId),
    { signal },
  );
}

export function getHospitalReviews({
  hospitalId,
  treatmentId,
  scope,
  sort,
  page,
  size,
  signal,
}: GetHospitalReviewsParams) {
  return apiGet<ReviewListResponse>(
    `${getHospitalTreatmentPath(hospitalId, treatmentId)}/reviews`,
    { params: { scope, sort, page, size }, signal },
  );
}

export function getHospitalReviewKeywords({
  hospitalId,
  treatmentId,
  signal,
}: HospitalTreatmentParams) {
  return apiGet<ReviewKeywordResponse>(
    `${getHospitalTreatmentPath(hospitalId, treatmentId)}/review-keywords`,
    { signal },
  );
}
