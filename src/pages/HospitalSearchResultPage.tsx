import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import mapIcon from '@/assets/icons/mapIcon.svg';
import FilterChip from '@/components/common/FilterChip';
import MenuTrigger from '@/components/common/MenuTrigger';
import Tab, { type TabItem } from '@/components/common/Tab';
import TreatmentCategorySheet from '@/components/common/TreatmentCategorySheet';
import TreatmentCategoriesStatus from '@/components/common/TreatmentCategoriesStatus';
import HospitalSearchFilterSheet from '@/components/hospital/HospitalSearchFilterSheet';
import HospitalSearchResultList from '@/components/hospital/HospitalSearchResultList';
import HospitalListFeedback from '@/components/hospital/HospitalListFeedback';
import Header from '@/components/layout/Header';
import TopArea from '@/components/layout/TopArea';
import {
  defaultHospitalSortOptions,
  hospitalSearchPriceRange,
  lowestPriceSortOption,
} from '@/constants/hospitalSearch';
import { useHospitalRegions } from '@/hooks/useHospitalRegions';
import { useHospitalList } from '@/hooks/useHospitalList';
import { useTreatmentCategories } from '@/hooks/useTreatmentCategories';
import { useHospitalListState } from '@/hooks/useHospitalListState';
import { usePageScrollPosition } from '@/hooks/usePageScrollPosition';
import type { TreatmentScope } from '@/types/treatment';
import type {
  HospitalSearchFilterState,
  HospitalSearchTab,
  HospitalSort,
} from '@/types/hospitalSearch';
import { getHospitalListParams } from '@/utils/hospitalList';
import {
  getSelectedProcedureIds,
  REGION_QUERY_KEY,
  parseRegionSelection,
  getFilterState,
  getFilterSearchParams,
  getScopeSearchParams,
  getProcedureSearchParams,
  getNormalizedPriceSearchParams,
  getTreatmentScope,
} from '@/utils/hospitalSearchUrl';
import { getFilterSummaryLabel } from '@/utils/hospitalFilterSummary';
import { UNSUPPORTED_FEATURE_MESSAGE, useToast } from '@/hooks/useToast';

const PRICE_MINIMUM = hospitalSearchPriceRange.min;
const PRICE_MAXIMUM = hospitalSearchPriceRange.max;

const hospitalSearchTabItems: TabItem<HospitalSearchTab>[] = [
  { value: 'integrated', label: '통합' },
  { value: 'hospital', label: '병원' },
  { value: 'consultation', label: '의료상담' },
  { value: 'blog', label: '블로그' },
];

function HospitalSearchResultPage() {
  const showToast = useToast();
  const regionOptions = useHospitalRegions();
  const {
    regions: hospitalSearchRegions,
    districtStatuses,
    loadDistricts,
  } = regionOptions;
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { categories: medicalCategories, status: categoriesStatus } =
    useTreatmentCategories();
  const treatmentScope = useMemo(
    () => getTreatmentScope(searchParams, medicalCategories),
    [searchParams, medicalCategories],
  );
  const [isCategorySheetOpen, setCategorySheetOpen] = useState(false);
  const categoryTriggerRef = useRef<HTMLElement>(null);
  const medicalCategory =
    medicalCategories.find(
      ({ id }) => id === treatmentScope?.medicalCategoryId,
    ) ?? medicalCategories[0];
  const treatmentCategory = medicalCategory?.treatmentCategories.find(
    ({ id }) => id === treatmentScope?.treatmentCategoryId,
  );
  const treatments = useMemo(
    () =>
      treatmentCategory
        ? treatmentCategory.treatments
        : (medicalCategory?.treatmentCategories.flatMap(
            ({ treatments: categoryTreatments }) => categoryTreatments,
          ) ?? []),
    [medicalCategory, treatmentCategory],
  );
  const selectedProcedureIds = useMemo(
    () => getSelectedProcedureIds(searchParams, treatments),
    [searchParams, treatments],
  );
  const activeProcedureIds = useMemo(
    () =>
      selectedProcedureIds.length > 0
        ? selectedProcedureIds
        : treatments.map(({ id }) => id),
    [selectedProcedureIds, treatments],
  );
  const { listState, setListState } = useHospitalListState('search');
  const selectedSort = listState.sort;
  const handleSortChange = (sort: HospitalSort) => setListState({ sort });
  const [isFilterSheetOpen, setFilterSheetOpen] = useState(false);
  const [filterSheetSession, setFilterSheetSession] = useState(0);
  const filterTriggerRef = useRef<HTMLButtonElement>(null);
  const appliedFilterState = useMemo(
    () =>
      getFilterState(
        searchParams,
        hospitalSearchRegions,
        hospitalSearchRegions
          .filter(({ id }) => districtStatuses[id] === 'success')
          .map(({ id }) => id),
        regionOptions.status === 'success',
      ),
    [
      searchParams,
      hospitalSearchRegions,
      districtStatuses,
      regionOptions.status,
    ],
  );
  const areSelectedRegionsReady =
    !searchParams.has(REGION_QUERY_KEY) ||
    (regionOptions.status === 'success' &&
      appliedFilterState.regionSelections.every(
        ({ regionId, districtId }) =>
          regionId === districtId || districtStatuses[regionId] === 'success',
      ));
  const hospitalList = useHospitalList(
    'search',
    categoriesStatus === 'success' && treatmentScope && areSelectedRegionsReady
      ? getHospitalListParams({
          scope: treatmentScope,
          procedureIds: selectedProcedureIds,
          sort: selectedSort,
          filters: appliedFilterState,
        })
      : null,
  );
  usePageScrollPosition(
    categoriesStatus === 'success' &&
      areSelectedRegionsReady &&
      hospitalList.status === 'success',
  );
  useEffect(() => {
    for (const value of searchParams.getAll(REGION_QUERY_KEY)) {
      const selection = parseRegionSelection(value);
      if (
        selection &&
        selection.regionId !== selection.districtId &&
        hospitalSearchRegions.some(({ id }) => id === selection.regionId) &&
        districtStatuses[selection.regionId] === undefined
      )
        loadDistricts(selection.regionId);
    }
  }, [searchParams, hospitalSearchRegions, districtStatuses, loadDistricts]);
  useEffect(() => {
    const nextSearchParams = getNormalizedPriceSearchParams(
      searchParams,
      appliedFilterState.priceRange,
    );

    if (nextSearchParams.toString() !== searchParams.toString()) {
      setSearchParams(nextSearchParams, {
        replace: true,
        state: location.state,
      });
    }
  }, [
    appliedFilterState.priceRange,
    location.state,
    searchParams,
    setSearchParams,
  ]);
  if (
    treatmentScope &&
    selectedProcedureIds.length === 0 &&
    selectedSort === 'lowest-price'
  ) {
    setListState({ sort: 'most-visited' });
  }

  const hasAppliedFilter =
    appliedFilterState.regionSelections.length > 0 ||
    appliedFilterState.priceRange.min !== PRICE_MINIMUM ||
    appliedFilterState.priceRange.max !== PRICE_MAXIMUM ||
    appliedFilterState.treatmentConditionIds.length > 0;
  const filterChipLabel = hasAppliedFilter
    ? getFilterSummaryLabel(appliedFilterState, hospitalSearchRegions)
    : '필터';

  const handleProcedureClick = (procedureId: number) => {
    const nextProcedureIds = selectedProcedureIds.includes(procedureId)
      ? selectedProcedureIds.filter((id) => id !== procedureId)
      : [...selectedProcedureIds, procedureId];
    const nextSearchParams = getProcedureSearchParams(
      searchParams,
      nextProcedureIds,
    );

    setSearchParams(nextSearchParams, { state: location.state });
  };

  const handleFilterApply = (filterState: HospitalSearchFilterState) => {
    const nextSearchParams = getFilterSearchParams(searchParams, filterState);

    setSearchParams(nextSearchParams, { state: location.state });
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
      scope.medicalCategoryId === treatmentScope?.medicalCategoryId &&
      scope.treatmentCategoryId === treatmentScope?.treatmentCategoryId
    ) {
      return;
    }

    const nextSearchParams = getScopeSearchParams(searchParams, scope);

    setSearchParams(nextSearchParams, { state: location.state });
  };

  const sortOptions =
    selectedProcedureIds.length > 0
      ? [...defaultHospitalSortOptions, lowestPriceSortOption]
      : defaultHospitalSortOptions;
  const selectedSortOption =
    sortOptions.find((option) => option.value === selectedSort) ??
    sortOptions[0];
  const hasRegionError =
    regionOptions.status === 'error' ||
    appliedFilterState.regionSelections.some(
      ({ regionId }) => districtStatuses[regionId] === 'error',
    );

  return (
    <>
      <TopArea>
        <Header
          type="DetailSearch"
          onBackClick={() => {
            navigate(
              {
                pathname: '/mall/university',
                search:
                  typeof location.state?.homeSearch === 'string'
                    ? location.state.homeSearch
                    : '',
              },
              {
                replace: true,
                state: {
                  restoreListStateKey:
                    typeof location.state?.homeListStateKey === 'string'
                      ? location.state.homeListStateKey
                      : undefined,
                },
              },
            );
          }}
          categoryName={
            treatmentCategory?.name ?? medicalCategory?.name ?? '병원 검색'
          }
          isTitleDisabled={!treatmentScope}
          isTitleOpen={isCategorySheetOpen}
          onTitleClick={handleCategorySheetOpen}
          onSearchClick={() => showToast(UNSUPPORTED_FEATURE_MESSAGE)}
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
      </TopArea>
      <div className="-mx-padding-m bg-surface-default pt-padding-xs">
        <Tab
          items={hospitalSearchTabItems}
          selectedValue="hospital"
          onValueChange={(tab) => {
            if (tab !== 'hospital') showToast(UNSUPPORTED_FEATURE_MESSAGE);
          }}
          layout="fill"
        />
      </div>
      <TreatmentCategoriesStatus />
      <fieldset
        disabled={!treatmentScope}
        className="sticky z-10 -mx-padding-m flex items-center justify-between bg-surface-default px-padding-m py-padding-s disabled:opacity-50"
        style={{
          top: `calc(env(safe-area-inset-top) + ${treatments.length > 0 ? 100 : 52}px)`,
        }}
      >
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
          onValueChange={handleSortChange}
        />
      </fieldset>
      {treatmentScope && !areSelectedRegionsReady && (
        <div className="flex flex-col items-center gap-gap-s py-padding-l text-center typography-body-regular text-text-secondary">
          <p role={hasRegionError ? 'alert' : 'status'}>
            {hasRegionError
              ? '지역 조건을 불러오지 못했어요.'
              : '지역 조건을 불러오는 중이에요.'}
          </p>
          {hasRegionError && (
            <button
              type="button"
              className="min-h-11 px-padding-m text-text-brand"
              onClick={() => {
                if (regionOptions.status === 'error') {
                  regionOptions.retryRegions();
                } else {
                  for (const {
                    regionId,
                  } of appliedFilterState.regionSelections) {
                    if (districtStatuses[regionId] === 'error')
                      loadDistricts(regionId, true);
                  }
                }
              }}
            >
              다시 시도
            </button>
          )}
        </div>
      )}
      {treatmentScope && areSelectedRegionsReady && (
        <>
          {(hospitalList.hospitals.length > 0 ||
            hospitalList.status === 'success') && (
            <HospitalSearchResultList hospitals={hospitalList.hospitals} />
          )}
          <HospitalListFeedback
            status={hospitalList.status}
            hasHospitals={hospitalList.hospitals.length > 0}
            hasNext={hospitalList.hasNext}
            onRetry={hospitalList.retry}
            onMoreClick={hospitalList.loadMore}
          />
        </>
      )}
      <div className="pointer-events-none fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+20px)] z-20 mx-auto flex w-full max-w-[480px] justify-end px-padding-m">
        <button
          type="button"
          onClick={() => showToast(UNSUPPORTED_FEATURE_MESSAGE)}
          className="pointer-events-auto inline-flex h-10 w-[105px] items-center justify-center gap-gap-xs rounded-[var(--radius-full)] border border-border-weak bg-interaction-neutral-inverse px-padding-s typography-label-large-medium text-text-brand shadow-[0_0_4px_rgb(0_0_0/12%)]"
        >
          <img src={mapIcon} alt="" className="size-5 shrink-0" />
          지도보기
        </button>
      </div>
      {treatmentScope && (
        <TreatmentCategorySheet
          isOpen={isCategorySheetOpen}
          categories={medicalCategories}
          selectedScope={treatmentScope}
          onSelect={handleScopeSelect}
          onClose={() => setCategorySheetOpen(false)}
          triggerRef={categoryTriggerRef}
          topOffset="calc(env(safe-area-inset-top) + 52px)"
        />
      )}
      <HospitalSearchFilterSheet
        regionOptions={regionOptions}
        key={filterSheetSession}
        isOpen={isFilterSheetOpen}
        onClose={() => setFilterSheetOpen(false)}
        initialFilterState={appliedFilterState}
        procedureIds={activeProcedureIds}
        onApply={handleFilterApply}
        triggerRef={filterTriggerRef}
      />
    </>
  );
}

export default HospitalSearchResultPage;
