import { defaultTreatmentScope } from '@/constants/treatment';
import { medicalCategories } from '@/mocks/treatment';
import type { TreatmentScope } from '@/types/treatment';

export function getTreatmentScope(
  searchParams: URLSearchParams,
): TreatmentScope {
  const medicalCategoryValue = searchParams.get('medicalCategory');
  const treatmentCategoryValue = searchParams.get('treatmentCategory');

  if (medicalCategoryValue === null && treatmentCategoryValue === null) {
    return defaultTreatmentScope;
  }

  const medicalCategoryId =
    medicalCategoryValue === null
      ? defaultTreatmentScope.medicalCategoryId
      : Number(medicalCategoryValue);
  const medicalCategory = medicalCategories.find(
    ({ id }) => id === medicalCategoryId,
  );

  if (!medicalCategory) {
    return defaultTreatmentScope;
  }

  if (treatmentCategoryValue === null || treatmentCategoryValue === 'all') {
    return { medicalCategoryId, treatmentCategoryId: null };
  }

  const treatmentCategory = medicalCategory.treatmentCategories.find(
    ({ id }) => id === Number(treatmentCategoryValue),
  );

  if (!treatmentCategory) {
    return medicalCategoryId === defaultTreatmentScope.medicalCategoryId
      ? defaultTreatmentScope
      : { medicalCategoryId, treatmentCategoryId: null };
  }

  return { medicalCategoryId, treatmentCategoryId: treatmentCategory.id };
}

export function getTreatmentSearchParams(
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

  return searchParams;
}

export function getHospitalSearchUrl(
  scope: TreatmentScope,
  selectedProcedureId: number | null = null,
) {
  const searchParams = getTreatmentSearchParams(scope, selectedProcedureId);

  return `/mall/university/results?${searchParams.toString()}`;
}
