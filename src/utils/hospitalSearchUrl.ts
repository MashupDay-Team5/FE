import type { TreatmentScope } from '@/types/treatment';

export function getHospitalSearchUrl(
  scope: TreatmentScope,
  selectedProcedureId: number | null = null,
) {
  const searchParams = new URLSearchParams({
    medicalCategory: String(scope.medicalCategoryId),
    treatmentCategory:
      scope.treatmentCategoryId === null
        ? 'all'
        : String(scope.treatmentCategoryId),
  });

  if (selectedProcedureId !== null) {
    searchParams.set('procedure', String(selectedProcedureId));
  }

  return `/mall/university/results?${searchParams.toString()}`;
}
