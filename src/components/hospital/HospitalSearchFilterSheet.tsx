import { useEffect, useState, type RefObject } from 'react';
import { useSheetDialog } from '@/hooks/useSheetDialog';
import closeIcon from '@/assets/icons/close.svg';
import closeSmallIcon from '@/assets/icons/close-small.svg';
import checkboxCheckedIcon from '@/assets/icons/checkboxChecked.svg';
import resetIcon from '@/assets/icons/resetIcon.svg';
import CategoryPicker from '@/components/common/CategoryPicker';
import RangeSlider, {
  type RangeSliderValue,
} from '@/components/common/RangeSlider';
import {
  MAX_SELECTED_REGION_COUNT,
  hospitalSearchPriceRange,
  hospitalSearchPriceStep,
  hospitalSearchTreatmentConditions,
} from '@/constants/hospitalSearch';
import type { HospitalRegionOptions } from '@/hooks/useHospitalRegions';
import { normalizeRegionSelections } from '@/utils/hospitalRegions';
import { hospitalSearchItems } from '@/mocks/hospitals';
import type {
  HospitalSearchIntegratedFilterCategory,
  HospitalSearchFilterState,
  HospitalSearchRegionSelection,
  HospitalSearchRegion,
  HospitalSearchTreatmentConditionId,
} from '@/types/hospitalSearch';
import { matchesHospitalSearchFilters } from '@/utils/hospitalSearch';

const REGION_LOADING_DELAY = 200;
const PRICE_MINIMUM = hospitalSearchPriceRange.min;
const PRICE_MAXIMUM = hospitalSearchPriceRange.max;
const DEFAULT_PRICE_RANGE: RangeSliderValue = {
  min: PRICE_MINIMUM,
  max: PRICE_MAXIMUM,
};

const filterCategoryTabs = [
  { value: 'region', label: '지역' },
  { value: 'price', label: '가격' },
  { value: 'treatment-condition', label: '진료조건' },
] as const;

type FilterCategoryTabsProps = {
  selectedValue: HospitalSearchIntegratedFilterCategory;
  onValueChange: (value: HospitalSearchIntegratedFilterCategory) => void;
  filterCounts: Partial<Record<HospitalSearchIntegratedFilterCategory, number>>;
};

function FilterCategoryTabs({
  selectedValue,
  onValueChange,
  filterCounts,
}: FilterCategoryTabsProps) {
  return (
    <div className="flex w-full items-center border-b border-border-neutral bg-surface-default pt-padding-xs">
      {filterCategoryTabs.map(({ value, label }) => {
        const isSelected = value === selectedValue;

        return (
          <button
            key={value}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onValueChange(value)}
            className={`flex h-[30px] min-w-0 flex-[1_0_0] flex-col items-center justify-end gap-gap-xs whitespace-nowrap text-center ${
              isSelected
                ? 'text-text-brand typography-body-bold'
                : 'text-text-disabled typography-body-medium'
            }`}
          >
            <span className="flex items-center gap-gap-xs">
              <span>{label}</span>
              {filterCounts[value] ? (
                <span className="flex size-5 items-center justify-center rounded-full bg-surface-brand typography-label-small-medium text-text-brand">
                  {filterCounts[value]}
                </span>
              ) : null}
            </span>
            <span
              aria-hidden="true"
              className={`h-1 w-full ${
                isSelected ? 'bg-border-brand' : 'bg-transparent'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}

type FilterRegionPanelProps = {
  regionOptions: HospitalRegionOptions;
  selectedRegionId: number | undefined;
  selectedDistrictIds: number[];
  onRegionChange: (regionId: number) => void;
  onDistrictClick: (regionId: number, districtId: number) => void;
};

function FilterRegionPanel({
  regionOptions,
  selectedRegionId,
  selectedDistrictIds,
  onRegionChange,
  onDistrictClick,
}: FilterRegionPanelProps) {
  const {
    regions: hospitalSearchRegions,
    status,
    districtStatuses,
    loadDistricts,
    retryRegions,
  } = regionOptions;
  const selectedRegion =
    hospitalSearchRegions.find(({ id }) => id === selectedRegionId) ??
    hospitalSearchRegions[0];

  if (status !== 'success' || !selectedRegion) {
    return (
      <RegionStatus
        status={status}
        emptyMessage="등록된 지역 선택지가 없어요."
        onRetry={retryRegions}
      />
    );
  }

  const districtStatus = districtStatuses[selectedRegion.id] ?? 'loading';

  return (
    <CategoryPicker
      categories={hospitalSearchRegions}
      selectedCategoryId={selectedRegion.id}
      onCategoryChange={onRegionChange}
      categoryWidth={136}
      unselectedCategoryWeight="regular"
    >
      {districtStatus !== 'success' ? (
        <RegionStatus
          status={districtStatus}
          onRetry={() => loadDistricts(selectedRegion.id, true)}
        />
      ) : (
        selectedRegion.districts.map(({ id, name }) => {
          const isSelected = selectedDistrictIds.includes(id);

          return (
            <button
              key={id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onDistrictClick(selectedRegion.id, id)}
              className={`flex h-[51px] w-full shrink-0 items-center border-b border-border-weak p-padding-m text-left ${
                isSelected
                  ? 'typography-label-large-medium text-text-brand'
                  : 'typography-label-large-regular text-text-primary'
              }`}
            >
              {name}
            </button>
          );
        })
      )}
    </CategoryPicker>
  );
}

function RegionStatus({
  status,
  emptyMessage,
  onRetry,
}: {
  status: 'loading' | 'error' | 'success';
  emptyMessage?: string;
  onRetry: () => void;
}) {
  if (status === 'loading') return <RegionLoading />;

  return (
    <div className="flex flex-col items-center gap-gap-s px-padding-m py-padding-l text-center typography-label-small-regular text-text-secondary">
      <p role={status === 'error' ? 'alert' : 'status'}>
        {status === 'error' ? '지역 선택지를 불러오지 못했어요.' : emptyMessage}
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="min-h-11 px-padding-s text-text-brand"
      >
        다시 시도
      </button>
    </div>
  );
}

function RegionLoading() {
  const [showPlaceholder, setShowPlaceholder] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(
      () => setShowPlaceholder(true),
      REGION_LOADING_DELAY,
    );
    return () => window.clearTimeout(timeoutId);
  }, []);

  return (
    <div role="status" aria-atomic="true" className="w-full">
      {showPlaceholder && (
        <span className="sr-only">지역 선택지를 불러오는 중이에요.</span>
      )}
      {showPlaceholder && (
        <div aria-hidden="true">
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className="flex h-[51px] items-center border-b border-border-weak px-padding-m"
            >
              <span className="h-3 w-16 rounded bg-surface-weak" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

type FilterPricePanelProps = {
  priceRange: RangeSliderValue;
  onPriceRangeChange: (priceRange: RangeSliderValue) => void;
  onPriceReset: () => void;
};

function FilterPricePanel({
  priceRange,
  onPriceRangeChange,
  onPriceReset,
}: FilterPricePanelProps) {
  const formatPrice = (price: number) => price.toLocaleString();

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-surface-default">
      <div className="flex items-center px-padding-m py-padding-l">
        <h3 className="typography-label-large-medium text-text-secondary">
          예산 범위
        </h3>
      </div>
      <div className="px-padding-l">
        <RangeSlider
          min={PRICE_MINIMUM}
          max={PRICE_MAXIMUM}
          step={hospitalSearchPriceStep}
          value={priceRange}
          onChange={onPriceRangeChange}
          formatValue={formatPrice}
          ariaLabel="예산 범위"
        />
      </div>
      <div className="mt-[32px] flex flex-col px-padding-m">
        <dl className="flex flex-col gap-y-padding-l">
          <div className="flex h-9 items-center gap-gap-l">
            <dt className="typography-label-large-regular text-text-secondary">
              최소
            </dt>
            <dd className="flex items-center gap-gap-s">
              <strong className="typography-title-bold text-text-primary">
                {formatPrice(priceRange.min)}만원
              </strong>
              <span className="typography-body-medium text-text-secondary">
                부터
              </span>
            </dd>
          </div>
          <div className="flex h-9 items-center gap-gap-l">
            <dt className="typography-label-large-regular text-text-secondary">
              최대
            </dt>
            <dd className="flex items-center gap-gap-s">
              <strong className="typography-title-bold text-text-primary">
                {formatPrice(priceRange.max)}만원
              </strong>
              <span className="typography-body-medium text-text-secondary">
                까지
              </span>
            </dd>
          </div>
        </dl>
        <div className="mt-padding-s flex h-11 items-center justify-end">
          <button
            type="button"
            onClick={onPriceReset}
            className="flex items-center gap-gap-xs typography-label-small-medium text-text-secondary"
          >
            가격 초기화
            <img src={resetIcon} alt="" width={20} height={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

type FilterTreatmentConditionPanelProps = {
  selectedConditionIds: HospitalSearchTreatmentConditionId[];
  onConditionClick: (conditionId: HospitalSearchTreatmentConditionId) => void;
};

function FilterTreatmentConditionPanel({
  selectedConditionIds,
  onConditionClick,
}: FilterTreatmentConditionPanelProps) {
  return (
    <div className="flex flex-col items-start gap-gap-xs bg-surface-default py-padding-m">
      {hospitalSearchTreatmentConditions.map(({ id, label, description }) => {
        const isSelected = selectedConditionIds.includes(id);

        return (
          <button
            key={id}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onConditionClick(id)}
            className="flex h-[72px] self-stretch items-center justify-between bg-interaction-neutral-inverse px-padding-m py-padding-xs text-left"
          >
            <span className="flex self-stretch flex-col justify-center gap-gap-xs">
              <span className="self-stretch typography-body-medium text-text-primary">
                {label}
              </span>
              {description ? (
                <span className="self-stretch typography-label-small-regular text-text-tertiary">
                  {description}
                </span>
              ) : null}
            </span>
            {isSelected ? (
              <img src={checkboxCheckedIcon} alt="" width={24} height={24} />
            ) : (
              <span
                aria-hidden="true"
                className="size-6 rounded-[4px] border border-border-neutral"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

type FilterSelectedRegionListProps = {
  regions: HospitalSearchRegion[];
  selections: HospitalSearchRegionSelection[];
  onRemove: (regionId: number, districtId: number) => void;
};

function FilterSelectedRegionList({
  regions: hospitalSearchRegions,
  selections,
  onRemove,
}: FilterSelectedRegionListProps) {
  return (
    <div
      aria-hidden={selections.length === 0}
      className="flex shrink-0 flex-col items-start gap-gap-s bg-surface-default py-padding-s"
    >
      <div className="px-padding-m">
        <p className="typography-caption-medium text-text-tertiary">
          {selections.length}/{MAX_SELECTED_REGION_COUNT}
        </p>
      </div>
      <div className="scrollbar-hidden flex items-center gap-gap-s overflow-x-auto px-padding-m">
        {selections.map(({ regionId, districtId }) => {
          const region = hospitalSearchRegions.find(
            ({ id }) => id === regionId,
          );
          const district = region?.districts.find(
            ({ id }) => id === districtId,
          );

          if (!region || !district) {
            return null;
          }

          return (
            <button
              key={districtId}
              type="button"
              aria-label={`${region.name} ${district.name} 선택 해제`}
              onClick={() => onRemove(regionId, districtId)}
              className="flex h-8 shrink-0 items-center justify-center gap-gap-xs rounded-[var(--radius-s)] bg-surface-weak px-padding-s typography-label-small-medium text-text-primary"
            >
              <span>
                {region.name} {district.name}
              </span>
              <span className="flex size-5 items-center justify-center">
                <img src={closeSmallIcon} alt="" width={20} height={20} />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

type FilterSheetBottomCtaProps = {
  isRegionReady: boolean;
  hospitalCount: number;
  onReset: () => void;
  onView: () => void;
};

function FilterSheetBottomCta({
  isRegionReady,
  hospitalCount,
  onReset,
  onView,
}: FilterSheetBottomCtaProps) {
  const isViewButtonEnabled = hospitalCount > 0 && isRegionReady;

  return (
    <div className="mt-auto shrink-0 bg-surface-default">
      <div className="mx-auto flex w-full max-w-[375px] items-center gap-gap-s px-padding-m py-padding-xs min-[376px]:max-w-none">
        <button
          type="button"
          onClick={onReset}
          className="flex h-[52px] w-[119px] shrink-0 flex-col items-center justify-center gap-gap-xs rounded-[var(--radius-s)] border border-border-brand bg-surface-default px-padding-m py-padding-s text-center typography-label-large-medium text-text-brand min-[376px]:w-auto min-[376px]:flex-[119_0_0]"
        >
          초기화
        </button>
        <button
          type="button"
          disabled={!isViewButtonEnabled}
          onClick={onView}
          className="flex h-[52px] w-[216px] min-w-[120px] flex-col items-center justify-center gap-gap-xs rounded-[var(--radius-s)] bg-interaction-brand px-padding-m py-padding-s text-center typography-label-large-medium text-text-inverse disabled:bg-interaction-disabled disabled:text-text-disabled min-[376px]:w-auto min-[376px]:flex-[216_0_0]"
        >
          {isRegionReady ? `${hospitalCount}개의 병원보기` : '지역 확인 필요'}
        </button>
      </div>
      <div className="h-[34px] self-stretch bg-surface-default p-[10px]" />
    </div>
  );
}

type HospitalSearchFilterSheetProps = {
  regionOptions: HospitalRegionOptions;
  isOpen: boolean;
  onClose: () => void;
  initialFilterState: HospitalSearchFilterState;
  procedureIds: number[];
  onApply: (filterState: HospitalSearchFilterState) => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
};

function HospitalSearchFilterSheet({
  regionOptions,
  isOpen,
  onClose,
  initialFilterState,
  procedureIds,
  onApply,
  triggerRef,
}: HospitalSearchFilterSheetProps) {
  const {
    regions: hospitalSearchRegions,
    districtStatuses,
    loadDistricts,
  } = regionOptions;
  const [selectedCategory, setSelectedCategory] =
    useState<HospitalSearchIntegratedFilterCategory>('region');
  const [selectedRegionId, setSelectedRegionId] = useState<number | undefined>(
    initialFilterState.regionSelections[0]?.regionId,
  );
  const [draftRegionSelections, setSelectedRegionSelections] = useState<
    HospitalSearchRegionSelection[]
  >(initialFilterState.regionSelections);
  const activeRegionId = hospitalSearchRegions.some(
    ({ id }) => id === selectedRegionId,
  )
    ? selectedRegionId
    : hospitalSearchRegions[0]?.id;
  const selectedRegionSelections = normalizeRegionSelections(
    draftRegionSelections,
    hospitalSearchRegions,
    hospitalSearchRegions
      .filter(({ id }) => districtStatuses[id] === 'success')
      .map(({ id }) => id),
  );
  const isRegionReady =
    regionOptions.status === 'success'
      ? selectedRegionSelections.every(
          ({ regionId, districtId }) =>
            hospitalSearchRegions.some(({ id }) => id === regionId) &&
            (regionId === districtId ||
              districtStatuses[regionId] === 'success'),
        )
      : draftRegionSelections.length === 0;

  useEffect(() => {
    if (isOpen && activeRegionId !== undefined) loadDistricts(activeRegionId);
  }, [isOpen, activeRegionId, loadDistricts]);
  const [priceRange, setPriceRange] = useState<RangeSliderValue>(
    initialFilterState.priceRange,
  );
  const [selectedTreatmentConditionIds, setSelectedTreatmentConditionIds] =
    useState<HospitalSearchTreatmentConditionId[]>(
      initialFilterState.treatmentConditionIds,
    );
  const { isRendered, isVisible, sheetRef, closeButtonRef } = useSheetDialog({
    isOpen,
    onClose,
    triggerRef,
  });

  const handleDistrictClick = (regionId: number, districtId: number) => {
    const selectedRegion = hospitalSearchRegions.find(
      ({ id }) => id === regionId,
    );

    if (!selectedRegion) {
      return;
    }

    setSelectedRegionSelections((currentSelections) => {
      const loadedRegionIds = hospitalSearchRegions
        .filter(({ id }) => districtStatuses[id] === 'success')
        .map(({ id }) => id);
      const validSelections = normalizeRegionSelections(
        currentSelections,
        hospitalSearchRegions,
        loadedRegionIds,
      );
      const isAlreadySelected = validSelections.some(
        (selection) => selection.districtId === districtId,
      );

      if (isAlreadySelected) {
        return validSelections.filter(
          (selection) => selection.districtId !== districtId,
        );
      }

      return normalizeRegionSelections(
        [...validSelections, { regionId, districtId }],
        hospitalSearchRegions,
        loadedRegionIds,
      );
    });
  };

  const handleReset = () => {
    setSelectedRegionSelections([]);
    setPriceRange(DEFAULT_PRICE_RANGE);
    setSelectedTreatmentConditionIds([]);
  };

  const handlePriceReset = () => {
    setPriceRange(DEFAULT_PRICE_RANGE);
  };

  const handleTreatmentConditionClick = (
    conditionId: HospitalSearchTreatmentConditionId,
  ) => {
    setSelectedTreatmentConditionIds((currentConditionIds) =>
      currentConditionIds.includes(conditionId)
        ? currentConditionIds.filter((id) => id !== conditionId)
        : [...currentConditionIds, conditionId],
    );
  };

  const selectedDistrictIds = selectedRegionSelections.map(
    ({ districtId }) => districtId,
  );
  const hasSelectedPriceRange =
    priceRange.min !== PRICE_MINIMUM || priceRange.max !== PRICE_MAXIMUM;
  const hasSelectedFilter =
    selectedRegionSelections.length > 0 ||
    hasSelectedPriceRange ||
    selectedTreatmentConditionIds.length > 0;
  const hospitalCount = hospitalSearchItems.filter((hospital) =>
    matchesHospitalSearchFilters(
      hospital,
      {
        regionSelections: selectedRegionSelections,
        priceRange,
        treatmentConditionIds: selectedTreatmentConditionIds,
      },
      procedureIds,
      hospitalSearchRegions,
    ),
  ).length;
  const filterCounts = {
    region: selectedRegionSelections.length,
    price: hasSelectedPriceRange ? 1 : undefined,
    'treatment-condition': selectedTreatmentConditionIds.length,
  };
  const handleApply = () => {
    const hasAppliedFilter =
      initialFilterState.regionSelections.length > 0 ||
      initialFilterState.priceRange.min !== PRICE_MINIMUM ||
      initialFilterState.priceRange.max !== PRICE_MAXIMUM ||
      initialFilterState.treatmentConditionIds.length > 0;

    if (!hasSelectedFilter && !hasAppliedFilter) {
      onClose();
      return;
    }

    if (hospitalCount === 0 || !isRegionReady) {
      return;
    }

    onApply({
      regionSelections: selectedRegionSelections,
      priceRange,
      treatmentConditionIds: selectedTreatmentConditionIds,
    });
  };

  if (!isRendered) {
    return null;
  }

  return (
    <div
      className={`fixed inset-y-0 left-1/2 z-20 flex w-full max-w-[480px] -translate-x-1/2 flex-col items-center justify-end bg-black/70 pt-[140px] transition-opacity duration-200 motion-reduce:transition-none ${
        isVisible ? 'opacity-100 ease-out' : 'opacity-0 ease-in'
      }`}
      onMouseDown={onClose}
    >
      <section
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="hospital-search-filter-title"
        className={`flex h-[calc(100dvh-140px)] max-h-[672px] w-full max-w-[480px] shrink-0 flex-col overflow-hidden rounded-t-[var(--radius-l)] bg-surface-default transition-transform duration-[400ms] motion-reduce:transition-none ${
          isVisible
            ? 'translate-y-0 ease-[cubic-bezier(0,0,0.4,1)]'
            : 'translate-y-full ease-in'
        }`}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="flex h-[60px] shrink-0 items-center justify-between bg-surface-default py-padding-xs pr-padding-s pl-padding-m">
          <h2
            id="hospital-search-filter-title"
            className="typography-headline-bold text-text-primary"
          >
            통합 필터
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            aria-label="통합 필터 닫기"
            onClick={onClose}
            className="flex size-11 shrink-0 items-center justify-center"
          >
            <img src={closeIcon} alt="" width={24} height={24} />
          </button>
        </header>
        <FilterCategoryTabs
          selectedValue={selectedCategory}
          onValueChange={setSelectedCategory}
          filterCounts={filterCounts}
        />
        <div className="flex min-h-0 flex-1 flex-col">
          {selectedCategory === 'region' && (
            <FilterRegionPanel
              regionOptions={regionOptions}
              selectedRegionId={activeRegionId}
              selectedDistrictIds={selectedDistrictIds}
              onRegionChange={setSelectedRegionId}
              onDistrictClick={handleDistrictClick}
            />
          )}
          {selectedCategory === 'price' && (
            <FilterPricePanel
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              onPriceReset={handlePriceReset}
            />
          )}
          {selectedCategory === 'treatment-condition' && (
            <FilterTreatmentConditionPanel
              selectedConditionIds={selectedTreatmentConditionIds}
              onConditionClick={handleTreatmentConditionClick}
            />
          )}
        </div>
        {selectedCategory === 'region' && (
          <div
            className={`shrink-0 overflow-hidden transition-[max-height] duration-200 ease-[cubic-bezier(0,0,0.4,1)] motion-reduce:transition-none ${
              selectedRegionSelections.length > 0 ? 'max-h-[82px]' : 'max-h-0'
            }`}
          >
            <div
              className={`transition-[transform,opacity] duration-200 ease-[cubic-bezier(0,0,0.4,1)] motion-reduce:transition-none ${
                selectedRegionSelections.length > 0
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-full opacity-0'
              }`}
            >
              <FilterSelectedRegionList
                regions={hospitalSearchRegions}
                selections={selectedRegionSelections}
                onRemove={handleDistrictClick}
              />
            </div>
          </div>
        )}
        <FilterSheetBottomCta
          isRegionReady={isRegionReady}
          hospitalCount={hospitalCount}
          onReset={handleReset}
          onView={handleApply}
        />
      </section>
    </div>
  );
}

export default HospitalSearchFilterSheet;
