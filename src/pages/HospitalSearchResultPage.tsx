import { useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import FilterChip from '@/components/common/FilterChip';
import MenuTrigger, {
  type MenuTriggerOption,
} from '@/components/common/MenuTrigger';
import Tab, { type TabItem } from '@/components/common/Tab';
import HospitalSearchFilterSheet from '@/components/hospital/HospitalSearchFilterSheet';
import Header from '@/components/layout/Header';
import TopArea from '@/components/layout/TopArea';
import {
  hospitalSearchProcedures,
  hospitalSearchRegions,
} from '@/mocks/hospitalSearch';
import type {
  HospitalSearchFilterState,
  HospitalSearchRegionSelection,
  HospitalSearchTab,
} from '@/types/hospitalSearch';

const PRICE_MINIMUM = 0;
const PRICE_MAXIMUM = 1000;
const PRICE_UNIT_IN_WON = 10000;
const REGION_QUERY_KEY = 'region';
const MIN_PRICE_QUERY_KEY = 'minPrice';
const MAX_PRICE_QUERY_KEY = 'maxPrice';
const MAX_FILTER_SUMMARY_LENGTH = 20;

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
    Math.max(PRICE_MINIMUM, priceInWon / PRICE_UNIT_IN_WON),
  );
}

function parseRegionSelection(value: string) {
  const [regionIdText, districtIdText] = value.split(':');
  const regionId = Number(regionIdText);
  const districtId = Number(districtIdText);

  if (!Number.isInteger(regionId) || !Number.isInteger(districtId)) {
    return undefined;
  }

  const region = hospitalSearchRegions.find(({ id }) => id === regionId);

  if (!region?.districts.some(({ id }) => id === districtId)) {
    return undefined;
  }

  return { regionId, districtId };
}

function getFilterState(
  searchParams: URLSearchParams,
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

  return {
    regionSelections,
    priceRange: {
      min: Math.min(minimumPrice, maximumPrice),
      max: Math.max(minimumPrice, maximumPrice),
    },
    treatmentConditionIds: [],
  };
}

function getRegionSummaryLabel(selection: HospitalSearchRegionSelection) {
  const region = hospitalSearchRegions.find(
    ({ id }) => id === selection.regionId,
  );
  const district = region?.districts.find(
    ({ id }) => id === selection.districtId,
  );

  if (!region || !district) {
    return undefined;
  }

  const abbreviatedRegionName = region.name
    .replace('특별', '')
    .replace('광역', '');

  return district.name === '전체'
    ? abbreviatedRegionName
    : `${abbreviatedRegionName} ${district.name}`;
}

function getFilterSummaryLabel(filterState: HospitalSearchFilterState) {
  const summaryLabels: string[] = [];
  let hiddenFilterCount = 0;
  const regionLabel = filterState.regionSelections
    .map(getRegionSummaryLabel)
    .find((label) => label !== undefined);

  if (regionLabel) {
    summaryLabels.push(regionLabel);
    hiddenFilterCount += filterState.regionSelections.length - 1;
  }

  const hasPriceFilter =
    filterState.priceRange.min !== PRICE_MINIMUM ||
    filterState.priceRange.max !== PRICE_MAXIMUM;

  if (hasPriceFilter) {
    summaryLabels.push('가격');
  }

  while (summaryLabels.length > 1) {
    const suffix = hiddenFilterCount > 0 ? ` 외 ${hiddenFilterCount}개` : '';

    if (
      `${summaryLabels.join(', ')}${suffix}`.length <= MAX_FILTER_SUMMARY_LENGTH
    ) {
      break;
    }

    summaryLabels.pop();
    hiddenFilterCount += 1;
  }

  const suffix = hiddenFilterCount > 0 ? ` 외 ${hiddenFilterCount}개` : '';

  return `${summaryLabels.join(', ')}${suffix}`;
}

const hospitalSearchTabItems: TabItem<HospitalSearchTab>[] = [
  { value: 'integrated', label: '통합', disabled: true },
  { value: 'hospital', label: '병원' },
  { value: 'consultation', label: '의료상담', disabled: true },
  { value: 'blog', label: '블로그', disabled: true },
];

type HospitalSort =
  'most-visited' | 'highest-rating' | 'most-reviews' | 'lowest-price';

const defaultHospitalSortOptions: MenuTriggerOption<HospitalSort>[] = [
  { value: 'most-visited', label: '방문 많은 순' },
  { value: 'highest-rating', label: '평점순' },
  { value: 'most-reviews', label: '리뷰 많은 순' },
];

const lowestPriceSortOption: MenuTriggerOption<HospitalSort> = {
  value: 'lowest-price',
  label: '낮은 가격 순',
};

function HospitalSearchResultPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedProcedureIds, setSelectedProcedureIds] = useState<number[]>(
    [],
  );
  const [selectedTab, setSelectedTab] = useState<HospitalSearchTab>('hospital');
  const [selectedSort, setSelectedSort] =
    useState<HospitalSort>('most-visited');
  const [isFilterSheetOpen, setFilterSheetOpen] = useState(false);
  const [filterSheetSession, setFilterSheetSession] = useState(0);
  const filterTriggerRef = useRef<HTMLButtonElement>(null);
  const appliedFilterState = useMemo(
    () => getFilterState(searchParams),
    [searchParams],
  );
  const hasAppliedFilter =
    appliedFilterState.regionSelections.length > 0 ||
    appliedFilterState.priceRange.min !== PRICE_MINIMUM ||
    appliedFilterState.priceRange.max !== PRICE_MAXIMUM;
  const filterChipLabel = hasAppliedFilter
    ? getFilterSummaryLabel(appliedFilterState)
    : '필터';

  const handleProcedureClick = (procedureId: number) => {
    setSelectedProcedureIds((currentIds) =>
      currentIds.includes(procedureId)
        ? currentIds.filter((id) => id !== procedureId)
        : [...currentIds, procedureId],
    );
  };

  const handleFilterApply = (filterState: HospitalSearchFilterState) => {
    const nextSearchParams = new URLSearchParams(searchParams);

    nextSearchParams.delete(REGION_QUERY_KEY);
    nextSearchParams.delete(MIN_PRICE_QUERY_KEY);
    nextSearchParams.delete(MAX_PRICE_QUERY_KEY);

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

    setSearchParams(nextSearchParams);
    setFilterSheetOpen(false);
  };

  const handleFilterSheetOpen = () => {
    setFilterSheetSession((currentSession) => currentSession + 1);
    setFilterSheetOpen(true);
  };

  const sortOptions =
    selectedProcedureIds.length > 0
      ? [...defaultHospitalSortOptions, lowestPriceSortOption]
      : defaultHospitalSortOptions;
  const selectedSortOption =
    sortOptions.find((option) => option.value === selectedSort) ??
    sortOptions[0];

  return (
    <>
      <TopArea>
        <Header type="DetailSearch" categoryName="시력교정술" />
        <div className="flex gap-gap-xs overflow-x-auto pl-padding-m py-padding-xs [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {hospitalSearchProcedures.map((procedure) => (
            <FilterChip
              key={procedure.id}
              label={procedure.name}
              selected={selectedProcedureIds.includes(procedure.id)}
              onClick={() => handleProcedureClick(procedure.id)}
            />
          ))}
          <div aria-hidden="true" className="h-8 w-4 shrink-0" />
        </div>
        <div className="bg-surface-default pt-padding-xs">
          <Tab
            items={hospitalSearchTabItems}
            selectedValue={selectedTab}
            onValueChange={setSelectedTab}
            layout="fill"
          />
        </div>
        <div className="flex items-center justify-between bg-surface-default px-padding-m py-padding-s">
          <FilterChip
            ref={filterTriggerRef}
            label={filterChipLabel}
            selected={hasAppliedFilter}
            showIcon
            onClick={handleFilterSheetOpen}
          />
          <MenuTrigger<HospitalSort>
            label={selectedSortOption.label}
            size="s"
            options={sortOptions}
            selectedValue={selectedSortOption.value}
            align="end"
            onValueChange={setSelectedSort}
          />
        </div>
      </TopArea>
      <HospitalSearchFilterSheet
        key={filterSheetSession}
        isOpen={isFilterSheetOpen}
        onClose={() => setFilterSheetOpen(false)}
        initialFilterState={appliedFilterState}
        onApply={handleFilterApply}
        triggerRef={filterTriggerRef}
      />
    </>
  );
}

export default HospitalSearchResultPage;
