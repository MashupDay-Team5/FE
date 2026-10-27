import { MAX_SELECTED_REGION_COUNT } from '@/constants/hospitalSearch';
import type {
  HospitalSearchRegion,
  HospitalSearchRegionSelection,
} from '@/types/hospitalSearch';

export function normalizeRegionSelections(
  selections: HospitalSearchRegionSelection[],
  regions: HospitalSearchRegion[],
  loadedRegionIds: number[] = regions.map(({ id }) => id),
) {
  return selections.reduce<HospitalSearchRegionSelection[]>(
    (current, selection) => {
      const region = regions.find(({ id }) => id === selection.regionId);
      if (
        !region ||
        (loadedRegionIds.includes(region.id) &&
          !region.districts.some(({ id }) => id === selection.districtId))
      )
        return current;
      if (current.some(({ districtId }) => districtId === selection.districtId))
        return current;

      const isWholeRegion = selection.districtId === region.id;
      const withoutConflicts = current.filter(
        (entry) =>
          entry.regionId !== region.id ||
          (!isWholeRegion && entry.districtId !== region.id),
      );
      if (withoutConflicts.length >= MAX_SELECTED_REGION_COUNT)
        return withoutConflicts;
      return [...withoutConflicts, selection];
    },
    [],
  );
}
