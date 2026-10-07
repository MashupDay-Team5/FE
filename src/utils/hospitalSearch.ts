import { hospitalSearchPriceUnitInWon } from '@/constants/hospitalSearch';
import type {
  HospitalSearchFilterState,
  HospitalSearchItem,
  HospitalSearchRegion,
} from '@/types/hospitalSearch';

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
  const priceRangeInWon = {
    min: filterState.priceRange.min * hospitalSearchPriceUnitInWon,
    max: filterState.priceRange.max * hospitalSearchPriceUnitInWon,
  };
  const matchesProcedureAndPrice = hospital.priceCards.some(
    ({ procedureId, priceAmount }) =>
      procedureIds.includes(procedureId) &&
      priceAmount >= priceRangeInWon.min &&
      priceAmount <= priceRangeInWon.max,
  );
  const matchesTreatmentConditions = filterState.treatmentConditionIds.every(
    (conditionId) => hospital.treatmentConditionIds.includes(conditionId),
  );

  return (
    matchesRegion && matchesProcedureAndPrice && matchesTreatmentConditions
  );
}
