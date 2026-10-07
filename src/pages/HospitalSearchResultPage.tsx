import { useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import FilterChip from '@/components/common/FilterChip';
import MenuTrigger, {
  type MenuTriggerOption,
} from '@/components/common/MenuTrigger';
import Tab, { type TabItem } from '@/components/common/Tab';
import TreatmentCategorySheet from '@/components/common/TreatmentCategorySheet';
import HospitalSearchFilterSheet from '@/components/hospital/HospitalSearchFilterSheet';
import HospitalSearchResultList from '@/components/hospital/HospitalSearchResultList';
import Header from '@/components/layout/Header';
import TopArea from '@/components/layout/TopArea';
import {
  MAX_SELECTED_REGION_COUNT,
  hospitalSearchPriceRange,
  hospitalSearchPriceUnitInWon,
  hospitalSearchTreatmentConditions,
} from '@/constants/hospitalSearch';
import {
  hospitalSearchItems,
  hospitalSearchRegions,
} from '@/mocks/hospitalSearch';
import { defaultTreatmentScope } from '@/constants/treatment';
import { medicalCategories } from '@/mocks/treatment';
import type { Treatment, TreatmentScope } from '@/types/treatment';
import type {
  HospitalSearchFilterState,
  HospitalSearchRegionSelection,
  HospitalSearchTab,
  HospitalSearchTreatmentConditionId,
} from '@/types/hospitalSearch';

const PRICE_MINIMUM = hospitalSearchPriceRange.min;
const PRICE_MAXIMUM = hospitalSearchPriceRange.max;
const PRICE_UNIT_IN_WON = hospitalSearchPriceUnitInWon;
const MEDICAL_CATEGORY_QUERY_KEY = 'medicalCategory';
const TREATMENT_CATEGORY_QUERY_KEY = 'treatmentCategory';
const PROCEDURE_QUERY_KEY = 'procedure';
const REGION_QUERY_KEY = 'region';
const MIN_PRICE_QUERY_KEY = 'minPrice';
const MAX_PRICE_QUERY_KEY = 'maxPrice';
const TREATMENT_CONDITION_QUERY_KEY = 'treatmentCondition';

function getTreatmentScope(searchParams: URLSearchParams): TreatmentScope {
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

function getSelectedProcedureIds(
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

function parseTreatmentConditionId(value: string) {
  const treatmentCondition = hospitalSearchTreatmentConditions.find(
    ({ id }) => id === value,
  );

  return treatmentCondition?.id;
}

function normalizeRegionSelections(
  selections: HospitalSearchRegionSelection[],
) {
  const normalizedSelections = selections.reduce<
    HospitalSearchRegionSelection[]
  >((currentSelections, selection) => {
    const region = hospitalSearchRegions.find(
      ({ id }) => id === selection.regionId,
    );

    if (
      !region ||
      currentSelections.some(
        ({ districtId }) => districtId === selection.districtId,
      )
    ) {
      return currentSelections;
    }

    const wholeDistrictId = region.districts[0].id;
    const isWholeRegion = selection.districtId === wholeDistrictId;
    const selectionsWithoutConflicts = currentSelections.filter(
      (currentSelection) =>
        currentSelection.regionId !== selection.regionId ||
        (!isWholeRegion && currentSelection.districtId !== wholeDistrictId),
    );

    return [...selectionsWithoutConflicts, selection];
  }, []);

  return normalizedSelections.slice(0, MAX_SELECTED_REGION_COUNT);
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
    regionSelections: normalizeRegionSelections(regionSelections),
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

  const treatmentCondition = hospitalSearchTreatmentConditions.find(({ id }) =>
    filterState.treatmentConditionIds.includes(id),
  );

  if (treatmentCondition) {
    summaryLabels.push(treatmentCondition.label);
    hiddenFilterCount += filterState.treatmentConditionIds.length - 1;
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
  const treatmentScope = useMemo(
    () => getTreatmentScope(searchParams),
    [searchParams],
  );
  const [isCategorySheetOpen, setCategorySheetOpen] = useState(false);
  const categoryTriggerRef = useRef<HTMLElement>(null);
  const medicalCategory =
    medicalCategories.find(
      ({ id }) => id === treatmentScope.medicalCategoryId,
    ) ?? medicalCategories[0];
  const treatmentCategory = medicalCategory.treatmentCategories.find(
    ({ id }) => id === treatmentScope.treatmentCategoryId,
  );
  const treatments = useMemo(
    () =>
      treatmentCategory
        ? treatmentCategory.treatments
        : medicalCategory.treatmentCategories.flatMap(
            ({ treatments: categoryTreatments }) => categoryTreatments,
          ),
    [medicalCategory, treatmentCategory],
  );
  const selectedProcedureIds = useMemo(
    () => getSelectedProcedureIds(searchParams, treatments),
    [searchParams, treatments],
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

  if (selectedProcedureIds.length === 0 && selectedSort === 'lowest-price') {
    setSelectedSort('most-visited');
  }

  const hasAppliedFilter =
    appliedFilterState.regionSelections.length > 0 ||
    appliedFilterState.priceRange.min !== PRICE_MINIMUM ||
    appliedFilterState.priceRange.max !== PRICE_MAXIMUM ||
    appliedFilterState.treatmentConditionIds.length > 0;
  const filterChipLabel = hasAppliedFilter
    ? getFilterSummaryLabel(appliedFilterState)
    : '필터';

  const handleProcedureClick = (procedureId: number) => {
    const nextProcedureIds = selectedProcedureIds.includes(procedureId)
      ? selectedProcedureIds.filter((id) => id !== procedureId)
      : [...selectedProcedureIds, procedureId];
    const nextSearchParams = new URLSearchParams(searchParams);

    nextSearchParams.delete(PROCEDURE_QUERY_KEY);
    nextProcedureIds.forEach((id) => {
      nextSearchParams.append(PROCEDURE_QUERY_KEY, String(id));
    });

    setSearchParams(nextSearchParams);
  };

  const handleFilterApply = (filterState: HospitalSearchFilterState) => {
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

    setSearchParams(nextSearchParams);
    setFilterSheetOpen(false);
  };

  const handleFilterSheetOpen = () => {
    setFilterSheetSession((currentSession) => currentSession + 1);
    setFilterSheetOpen(true);
  };

  const handleCategorySheetOpen = () => {
    categoryTriggerRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    setCategorySheetOpen((isOpen) => !isOpen);
  };

  const handleScopeSelect = (scope: TreatmentScope) => {
    if (
      scope.medicalCategoryId === treatmentScope.medicalCategoryId &&
      scope.treatmentCategoryId === treatmentScope.treatmentCategoryId
    ) {
      return;
    }

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
    setSearchParams(nextSearchParams);
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
        <Header
          type="DetailSearch"
          categoryName={treatmentCategory?.name ?? medicalCategory.name}
          isTitleOpen={isCategorySheetOpen}
          onTitleClick={handleCategorySheetOpen}
        />
        {treatments.length > 0 && (
          <div className="flex gap-gap-xs overflow-x-auto bg-surface-default pl-padding-m py-padding-xs [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {treatments.map((procedure) => (
              <FilterChip
                key={procedure.id}
                label={procedure.name}
                selected={selectedProcedureIds.includes(procedure.id)}
                onClick={() => handleProcedureClick(procedure.id)}
              />
            ))}
            <div aria-hidden="true" className="h-8 w-4 shrink-0" />
          </div>
        )}
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
      <HospitalSearchResultList hospitals={hospitalSearchItems} />
      <TreatmentCategorySheet
        isOpen={isCategorySheetOpen}
        categories={medicalCategories}
        selectedScope={treatmentScope}
        onSelect={handleScopeSelect}
        onClose={() => setCategorySheetOpen(false)}
        triggerRef={categoryTriggerRef}
        topOffset="calc(env(safe-area-inset-top) + 52px)"
      />
      <HospitalSearchFilterSheet
        key={filterSheetSession}
        isOpen={isFilterSheetOpen}
        onClose={() => setFilterSheetOpen(false)}
        initialFilterState={appliedFilterState}
        procedureIds={
          selectedProcedureIds.length > 0
            ? selectedProcedureIds
            : treatments.map(({ id }) => id)
        }
        onApply={handleFilterApply}
        triggerRef={filterTriggerRef}
      />
    </>
  );
}

export default HospitalSearchResultPage;
