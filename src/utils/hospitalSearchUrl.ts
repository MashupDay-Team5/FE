import type { TreatmentScope } from '@/types/treatment';

export function getHospitalSearchUrl(scope: TreatmentScope) {
  const searchParams = new URLSearchParams({
    medicalCategory: String(scope.medicalCategoryId),
    treatmentCategory:
      scope.treatmentCategoryId === null
        ? 'all'
        : String(scope.treatmentCategoryId),
  });

  return `/mall/university/results?${searchParams.toString()}`;
}
