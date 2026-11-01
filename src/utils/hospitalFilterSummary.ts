import {
  hospitalSearchPriceRange,
  hospitalSearchTreatmentConditions,
} from '@/constants/hospitalSearch';
import type {
  HospitalSearchFilterState,
  HospitalSearchRegion,
  HospitalSearchRegionSelection,
} from '@/types/hospitalSearch';

const PRICE_MINIMUM = hospitalSearchPriceRange.min;
const PRICE_MAXIMUM = hospitalSearchPriceRange.max;
const MAX_FILTER_SUMMARY_LENGTH = 20;

function getRegionSummaryLabel(
  selection: HospitalSearchRegionSelection,
  regions: HospitalSearchRegion[],
) {
  const region = regions.find(({ id }) => id === selection.regionId);
  const district = region?.districts.find(
    ({ id }) => id === selection.districtId,
  );

  if (!region) {
    return undefined;
  }

  const abbreviatedRegionName = region.name.replace(/특별시$|광역시$/, '');

  return !district || district.id === region.id
    ? abbreviatedRegionName
    : `${abbreviatedRegionName} ${district.name}`;
}

export function getFilterSummaryLabel(
  filterState: HospitalSearchFilterState,
  regions: HospitalSearchRegion[],
) {
  let hiddenFilterCount = 0;
  const regionLabel =
    filterState.regionSelections
      .map((selection) => getRegionSummaryLabel(selection, regions))
      .find((label) => label !== undefined) ??
    (filterState.regionSelections.length > 0 ? '지역' : undefined);

  if (regionLabel) {
    hiddenFilterCount += filterState.regionSelections.length - 1;
  }

  const hasPriceFilter =
    filterState.priceRange.min !== PRICE_MINIMUM ||
    filterState.priceRange.max !== PRICE_MAXIMUM;

  let priceLabel = hasPriceFilter
    ? `${filterState.priceRange.min}만원~${filterState.priceRange.max}만원`
    : undefined;

  const treatmentCondition = hospitalSearchTreatmentConditions.find(({ id }) =>
    filterState.treatmentConditionIds.includes(id),
  );

  let treatmentConditionLabel = treatmentCondition?.label;

  if (treatmentConditionLabel) {
    hiddenFilterCount += filterState.treatmentConditionIds.length - 1;
  }

  const getSummaryLabel = () => {
    const summaryLabels = [regionLabel, priceLabel, treatmentConditionLabel];
    const suffix = hiddenFilterCount > 0 ? ` 외 ${hiddenFilterCount}` : '';

    return `${summaryLabels.filter(Boolean).join(', ')}${suffix}`;
  };
  let summaryLabel = getSummaryLabel();

  if (
    Array.from(summaryLabel).length > MAX_FILTER_SUMMARY_LENGTH &&
    priceLabel &&
    (regionLabel || treatmentConditionLabel)
  ) {
    priceLabel = undefined;
    hiddenFilterCount += 1;
    summaryLabel = getSummaryLabel();
  }

  const overflowLength =
    Array.from(summaryLabel).length - MAX_FILTER_SUMMARY_LENGTH;

  if (overflowLength > 0 && treatmentConditionLabel) {
    const conditionCharacters = Array.from(treatmentConditionLabel);
    const ellipsis = '...';
    const visibleCharacterCount = Math.max(
      0,
      conditionCharacters.length - overflowLength - ellipsis.length,
    );

    treatmentConditionLabel = `${conditionCharacters
      .slice(0, visibleCharacterCount)
      .join('')}${ellipsis}`;
    summaryLabel = getSummaryLabel();
  }

  return summaryLabel;
}
