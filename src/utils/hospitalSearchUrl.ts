import {
  hospitalSearchPriceRange,
  hospitalSearchPriceStep,
  hospitalSearchPriceUnitInWon,
  hospitalSearchTreatmentConditions,
} from '@/constants/hospitalSearch';
import { normalizeRegionSelections } from '@/utils/hospitalRegions';
import type {
  HospitalSearchFilterState,
  HospitalSearchRegion,
  HospitalSearchRegionSelection,
  HospitalSearchTreatmentConditionId,
  HospitalSearchPriceRange,
} from '@/types/hospitalSearch';
import type {
  MedicalCategory,
  Treatment,
  TreatmentScope,
} from '@/types/treatment';

const PRICE_MINIMUM = hospitalSearchPriceRange.min;
const PRICE_MAXIMUM = hospitalSearchPriceRange.max;
const PRICE_UNIT_IN_WON = hospitalSearchPriceUnitInWon;
const MEDICAL_CATEGORY_QUERY_KEY = 'medicalCategory';
const TREATMENT_CATEGORY_QUERY_KEY = 'treatmentCategory';
const PROCEDURE_QUERY_KEY = 'procedure';
export const REGION_QUERY_KEY = 'region';
const MIN_PRICE_QUERY_KEY = 'minPrice';
const MAX_PRICE_QUERY_KEY = 'maxPrice';
const TREATMENT_CONDITION_QUERY_KEY = 'treatmentCondition';

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
  const medicalCategoryValue = searchParams.get(MEDICAL_CATEGORY_QUERY_KEY);
  const treatmentCategoryValue = searchParams.get(TREATMENT_CATEGORY_QUERY_KEY);

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
        .getAll(PROCEDURE_QUERY_KEY)
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
    [MEDICAL_CATEGORY_QUERY_KEY]: String(scope.medicalCategoryId),
    [TREATMENT_CATEGORY_QUERY_KEY]:
      scope.treatmentCategoryId === null
        ? 'all'
        : String(scope.treatmentCategoryId),
  });

  [...new Set(selectedProcedureIds)].forEach((procedureId) => {
    searchParams.append(PROCEDURE_QUERY_KEY, String(procedureId));
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

export function getHospitalDetailUrl(hospitalId: number) {
  return `/mall/university/hospitals/${hospitalId}`;
}

function parsePriceRangeValue(value: string | null, fallback: number) {
  if (!value) {
    return fallback;
  }

  const priceInWon = Number(value);

  if (!Number.isFinite(priceInWon)) {
    return fallback;
  }

  return Math.min(
    PRICE_MAXIMUM,
    Math.max(
      PRICE_MINIMUM,
      Math.round(priceInWon / PRICE_UNIT_IN_WON / hospitalSearchPriceStep) *
        hospitalSearchPriceStep,
    ),
  );
}

export function parseRegionSelection(value: string) {
  const parts = value.split(':');
  if (parts.length !== 2 || parts.some((part) => !/^\d+$/.test(part)))
    return undefined;
  const [regionIdText, districtIdText] = parts;
  const regionId = Number(regionIdText);
  const districtId = Number(districtIdText);

  if (!Number.isInteger(regionId) || !Number.isInteger(districtId)) {
    return undefined;
  }

  return { regionId, districtId };
}

function parseTreatmentConditionId(value: string) {
  const treatmentCondition = hospitalSearchTreatmentConditions.find(
    ({ id }) => id === value,
  );

  return treatmentCondition?.id;
}

export function getFilterState(
  searchParams: URLSearchParams,
  regions: HospitalSearchRegion[],
  loadedRegionIds: number[],
  regionsReady: boolean,
): HospitalSearchFilterState {
  const regionSelections = searchParams
    .getAll(REGION_QUERY_KEY)
    .map(parseRegionSelection)
    .filter(
      (selection): selection is HospitalSearchRegionSelection =>
        selection !== undefined,
    );
  const minimumPrice = parsePriceRangeValue(
    searchParams.get(MIN_PRICE_QUERY_KEY),
    PRICE_MINIMUM,
  );
  const maximumPrice = parsePriceRangeValue(
    searchParams.get(MAX_PRICE_QUERY_KEY),
    PRICE_MAXIMUM,
  );
  const treatmentConditionIds = Array.from(
    new Set(
      searchParams
        .getAll(TREATMENT_CONDITION_QUERY_KEY)
        .map(parseTreatmentConditionId)
        .filter(
          (conditionId): conditionId is HospitalSearchTreatmentConditionId =>
            conditionId !== undefined,
        ),
    ),
  );

  return {
    regionSelections: regionsReady
      ? normalizeRegionSelections(regionSelections, regions, loadedRegionIds)
      : regionSelections,
    priceRange: {
      min: Math.min(minimumPrice, maximumPrice),
      max: Math.max(minimumPrice, maximumPrice),
    },
    treatmentConditionIds,
  };
}

function clearFilterSearchParams(searchParams: URLSearchParams) {
  searchParams.delete(REGION_QUERY_KEY);
  clearPriceSearchParams(searchParams);
  searchParams.delete(TREATMENT_CONDITION_QUERY_KEY);
}

function clearPriceSearchParams(searchParams: URLSearchParams) {
  searchParams.delete(MIN_PRICE_QUERY_KEY);
  searchParams.delete(MAX_PRICE_QUERY_KEY);
}

export function getFilterSearchParams(
  searchParams: URLSearchParams,
  filterState: HospitalSearchFilterState,
) {
  const nextSearchParams = new URLSearchParams(searchParams);

  clearFilterSearchParams(nextSearchParams);

  filterState.regionSelections.forEach(({ regionId, districtId }) => {
    nextSearchParams.append(REGION_QUERY_KEY, `${regionId}:${districtId}`);
  });

  if (filterState.priceRange.min !== PRICE_MINIMUM) {
    nextSearchParams.set(
      MIN_PRICE_QUERY_KEY,
      String(filterState.priceRange.min * PRICE_UNIT_IN_WON),
    );
  }

  if (filterState.priceRange.max !== PRICE_MAXIMUM) {
    nextSearchParams.set(
      MAX_PRICE_QUERY_KEY,
      String(filterState.priceRange.max * PRICE_UNIT_IN_WON),
    );
  }

  filterState.treatmentConditionIds.forEach((conditionId) => {
    nextSearchParams.append(TREATMENT_CONDITION_QUERY_KEY, conditionId);
  });

  return nextSearchParams;
}

export function getScopeSearchParams(
  searchParams: URLSearchParams,
  scope: TreatmentScope,
) {
  const nextSearchParams = new URLSearchParams(searchParams);

  nextSearchParams.set(
    MEDICAL_CATEGORY_QUERY_KEY,
    String(scope.medicalCategoryId),
  );
  nextSearchParams.set(
    TREATMENT_CATEGORY_QUERY_KEY,
    scope.treatmentCategoryId === null
      ? 'all'
      : String(scope.treatmentCategoryId),
  );
  nextSearchParams.delete(PROCEDURE_QUERY_KEY);
  return nextSearchParams;
}

export function getProcedureSearchParams(
  searchParams: URLSearchParams,
  procedureIds: number[],
) {
  const nextSearchParams = new URLSearchParams(searchParams);

  nextSearchParams.delete(PROCEDURE_QUERY_KEY);
  procedureIds.forEach((id) => {
    nextSearchParams.append(PROCEDURE_QUERY_KEY, String(id));
  });

  return nextSearchParams;
}

export function getNormalizedPriceSearchParams(
  searchParams: URLSearchParams,
  priceRange: HospitalSearchPriceRange,
) {
  const nextSearchParams = new URLSearchParams(searchParams);
  const priceEntries = [
    [MIN_PRICE_QUERY_KEY, priceRange.min],
    [MAX_PRICE_QUERY_KEY, priceRange.max],
  ] as const;

  for (const [queryKey, price] of priceEntries) {
    if (searchParams.has(queryKey)) {
      nextSearchParams.set(queryKey, String(price * PRICE_UNIT_IN_WON));
    }
  }

  return nextSearchParams;
}
