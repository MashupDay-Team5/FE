import { hospitalSearchPriceUnitInWon } from '@/constants/hospitalSearch';
import type {
  HospitalSearchFilterState,
  HospitalSearchItem,
  HospitalSearchPriceCard,
  HospitalSearchPriceRange,
  HospitalSearchRegion,
  HospitalSort,
} from '@/types/hospitalSearch';

export function getSortedHospitals(
  hospitals: HospitalSearchItem[],
  sort: HospitalSort,
) {
  return hospitals.toSorted((firstHospital, secondHospital) => {
    switch (sort) {
      case 'most-visited':
        return (
          (secondHospital.visitCount ?? 0) - (firstHospital.visitCount ?? 0)
        );
      case 'highest-rating':
        return Number(secondHospital.rating) - Number(firstHospital.rating);
      case 'most-reviews':
        return (
          Number(secondHospital.reviewCount.replaceAll(',', '')) -
          Number(firstHospital.reviewCount.replaceAll(',', ''))
        );
      case 'lowest-price':
        return (
          Math.min(
            ...firstHospital.priceCards.map(({ priceAmount }) => priceAmount),
          ) -
          Math.min(
            ...secondHospital.priceCards.map(({ priceAmount }) => priceAmount),
          )
        );
    }
  });
}

export function matchesHospitalSearchPriceCard(
  priceCard: HospitalSearchPriceCard,
  priceRange: HospitalSearchPriceRange,
  procedureIds: number[],
) {
  return (
    procedureIds.includes(priceCard.procedureId) &&
    priceCard.priceAmount >= priceRange.min * hospitalSearchPriceUnitInWon &&
    priceCard.priceAmount <= priceRange.max * hospitalSearchPriceUnitInWon
  );
}

export function matchesHospitalSearchFilters(
  hospital: HospitalSearchItem,
  filterState: HospitalSearchFilterState,
  procedureIds: number[],
  regions: HospitalSearchRegion[],
) {
  const matchesRegion =
    filterState.regionSelections.length === 0 ||
    filterState.regionSelections.some(({ regionId, districtId }) => {
      const region = regions.find(({ id }) => id === regionId);
      const wholeDistrictId = region?.districts[0].id;

      return (
        hospital.regionId === regionId &&
        (districtId === wholeDistrictId || hospital.districtId === districtId)
      );
    });
  const matchesProcedureAndPrice = hospital.priceCards.some((priceCard) =>
    matchesHospitalSearchPriceCard(
      priceCard,
      filterState.priceRange,
      procedureIds,
    ),
  );
  const matchesTreatmentConditions = filterState.treatmentConditionIds.every(
    (conditionId) => hospital.treatmentConditionIds.includes(conditionId),
  );

  return (
    matchesRegion && matchesProcedureAndPrice && matchesTreatmentConditions
  );
}
