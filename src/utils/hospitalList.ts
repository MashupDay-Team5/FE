import {
  hospitalSearchPriceRange,
  hospitalSearchPriceUnitInWon,
} from '@/constants/hospitalSearch';
import type {
  HospitalListParams,
  HospitalListSort,
  HospitalResponse,
  HospitalTreatmentPriceResponse,
} from '@/types/hospital';
import type {
  HospitalSearchFilterState,
  HospitalSearchItem,
  HospitalSearchPriceCard,
  HospitalSearchTreatmentConditionId,
  HospitalSort,
} from '@/types/hospitalSearch';
import type { TreatmentScope } from '@/types/treatment';

const hospitalListSortValues: Record<HospitalSort, HospitalListSort> = {
  'most-visited': 'VISIT',
  'highest-rating': 'RATING',
  'most-reviews': 'REVIEW_COUNT',
  'lowest-price': 'LOW_PRICE',
};

type HospitalListSelection = {
  scope: TreatmentScope;
  procedureIds: readonly number[];
  sort: HospitalSort;
  filters?: HospitalSearchFilterState;
};

export function getHospitalListParams({
  scope,
  procedureIds,
  sort,
  filters,
}: HospitalListSelection): HospitalListParams {
  const treatmentIds = [...new Set(procedureIds)];
  const regionIds = filters
    ? [...new Set(filters.regionSelections.map(({ districtId }) => districtId))]
    : [];
  const conditions = filters?.treatmentConditionIds ?? [];

  return {
    mallId: 1,
    medicalCategoryId: scope.medicalCategoryId,
    treatmentCategoryId: scope.treatmentCategoryId ?? undefined,
    treatmentIds: treatmentIds.length > 0 ? treatmentIds : undefined,
    regionIds: regionIds.length > 0 ? regionIds : undefined,
    minPrice:
      filters && filters.priceRange.min !== hospitalSearchPriceRange.min
        ? filters.priceRange.min * hospitalSearchPriceUnitInWon
        : undefined,
    maxPrice:
      filters && filters.priceRange.max !== hospitalSearchPriceRange.max
        ? filters.priceRange.max * hospitalSearchPriceUnitInWon
        : undefined,
    hasSpecialist: conditions.includes('specialist') ? true : undefined,
    hasPublicPrice: conditions.includes('public-price') ? true : undefined,
    hasNightClinic: conditions.includes('night-clinic') ? true : undefined,
    hasHolidayClinic: conditions.includes('holiday-clinic') ? true : undefined,
    sort:
      sort === 'lowest-price' && treatmentIds.length === 0
        ? 'VISIT'
        : hospitalListSortValues[sort],
  };
}

export function toHospitalPriceCard(
  treatment: HospitalTreatmentPriceResponse,
): HospitalSearchPriceCard {
  const base = {
    procedureId: treatment.treatmentId,
    procedureName: treatment.treatmentName,
    priceAmount: treatment.displayPrice,
    originalPrice: `${treatment.regularPrice.toLocaleString('ko-KR')}원`,
  };

  if (treatment.priceType === 'REGULAR') {
    return {
      ...base,
      type: 'single',
      originalPrice: `${treatment.displayPrice.toLocaleString('ko-KR')}원`,
    };
  }

  return {
    ...base,
    type: 'default',
    discountedPrice: `${treatment.displayPrice.toLocaleString('ko-KR')}원`,
  };
}

export function toHospitalSearchItem(
  hospital: HospitalResponse,
): HospitalSearchItem {
  const treatmentConditionIds: HospitalSearchTreatmentConditionId[] = [];
  if (hospital.hasSpecialist) treatmentConditionIds.push('specialist');
  if (hospital.hasPublicPrice) treatmentConditionIds.push('public-price');
  if (hospital.hasNightClinic) treatmentConditionIds.push('night-clinic');
  if (hospital.hasHolidayClinic) treatmentConditionIds.push('holiday-clinic');

  return {
    hospitalId: hospital.hospitalId,
    hospitalName: hospital.name,
    regionId: hospital.region.sidoId,
    districtId: hospital.region.sigunguId,
    treatmentConditionIds,
    hasDiscount: hospital.treatments.some(
      ({ priceType }) => priceType === 'MALL',
    ),
    rating: hospital.rating.toFixed(1),
    reviewCount: String(hospital.reviewCount),
    address: hospital.address,
    badgeTypes: hospital.badgeTypes,
    priceCards: hospital.treatments.map(toHospitalPriceCard),
  };
}
