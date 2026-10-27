import type {
  MedicalCategory,
  Treatment,
  TreatmentScope,
} from '@/types/treatment';

export function getTreatmentScope(
  searchParams: URLSearchParams,
  medicalCategories: MedicalCategory[],
): TreatmentScope | null {
  const defaultMedicalCategory =
    medicalCategories.find(({ name }) => name === '안과') ??
    medicalCategories[0];

  if (!defaultMedicalCategory) {
    return null;
  }

  const defaultTreatmentScope: TreatmentScope = {
    medicalCategoryId: defaultMedicalCategory.id,
    treatmentCategoryId:
      defaultMedicalCategory.treatmentCategories.find(
        ({ name }) => name === '시력교정술',
      )?.id ?? null,
  };
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

export function getSelectedProcedureIds(
  searchParams: URLSearchParams,
  procedures: Treatment[],
) {
  return Array.from(
    new Set(
      searchParams
        .getAll('procedure')
        .map(Number)
        .filter((procedureId) =>
          procedures.some(({ id }) => id === procedureId),
        ),
    ),
  );
}

export function getTreatmentSearchParams(
  scope: TreatmentScope,
  selectedProcedureIds: number[] = [],
) {
  const searchParams = new URLSearchParams({
    medicalCategory: String(scope.medicalCategoryId),
    treatmentCategory:
      scope.treatmentCategoryId === null
        ? 'all'
        : String(scope.treatmentCategoryId),
  });

  [...new Set(selectedProcedureIds)].forEach((procedureId) => {
    searchParams.append('procedure', String(procedureId));
  });

  return searchParams;
}

export function getHospitalSearchUrl(
  scope: TreatmentScope,
  selectedProcedureIds: number[] = [],
) {
  const searchParams = getTreatmentSearchParams(scope, selectedProcedureIds);

  return `/mall/university/results?${searchParams.toString()}`;
}
