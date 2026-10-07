import { useEffect, useRef, useState, type RefObject } from 'react';
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
  hospitalSearchPriceUnitInWon,
  hospitalSearchTreatmentConditions,
} from '@/constants/hospitalSearch';
import {
  hospitalSearchItems,
  hospitalSearchRegions,
} from '@/mocks/hospitalSearch';
import type {
  HospitalSearchIntegratedFilterCategory,
  HospitalSearchFilterState,
  HospitalSearchRegionSelection,
  HospitalSearchTreatmentConditionId,
} from '@/types/hospitalSearch';

const SHEET_TRANSITION_DURATION = 400;
const PRICE_MINIMUM = hospitalSearchPriceRange.min;
const PRICE_MAXIMUM = hospitalSearchPriceRange.max;
const PRICE_UNIT_IN_WON = hospitalSearchPriceUnitInWon;
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
  selectedRegionId: number;
  selectedDistrictIds: number[];
  onRegionChange: (regionId: number) => void;
  onDistrictClick: (regionId: number, districtId: number) => void;
};

function FilterRegionPanel({
  selectedRegionId,
  selectedDistrictIds,
  onRegionChange,
  onDistrictClick,
}: FilterRegionPanelProps) {
  const selectedRegion =
    hospitalSearchRegions.find(({ id }) => id === selectedRegionId) ??
    hospitalSearchRegions[0];

  return (
    <CategoryPicker
      categories={hospitalSearchRegions}
      selectedCategoryId={selectedRegionId}
      onCategoryChange={onRegionChange}
    >
      {selectedRegion.districts.map(({ id, name }) => {
        const isSelected = selectedDistrictIds.includes(id);

        return (
          <button
            key={id}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onDistrictClick(selectedRegionId, id)}
            className={`flex h-[51px] w-full shrink-0 items-center border-b border-border-neutral p-padding-m text-left ${
              isSelected
                ? 'typography-label-large-medium text-text-brand'
                : 'typography-label-large-regular text-text-primary'
            }`}
          >
            {name}
          </button>
        );
      })}
    </CategoryPicker>
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
          step={50}
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
  selections: HospitalSearchRegionSelection[];
  onRemove: (regionId: number, districtId: number) => void;
};

function FilterSelectedRegionList({
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
  hospitalCount: number;
  onReset: () => void;
  onView: () => void;
};

function FilterSheetBottomCta({
  hospitalCount,
  onReset,
  onView,
}: FilterSheetBottomCtaProps) {
  const isViewButtonEnabled = hospitalCount > 0;

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
          {hospitalCount}개의 병원보기
        </button>
      </div>
      <div className="h-[34px] self-stretch bg-surface-default p-[10px]" />
    </div>
  );
}

type HospitalSearchFilterSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  initialFilterState: HospitalSearchFilterState;
  procedureIds: number[];
  onApply: (filterState: HospitalSearchFilterState) => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
};

function HospitalSearchFilterSheet({
  isOpen,
  onClose,
  initialFilterState,
  procedureIds,
  onApply,
  triggerRef,
}: HospitalSearchFilterSheetProps) {
  const [selectedCategory, setSelectedCategory] =
    useState<HospitalSearchIntegratedFilterCategory>('region');
  const [selectedRegionId, setSelectedRegionId] = useState(
    hospitalSearchRegions[0].id,
  );
  const [selectedRegionSelections, setSelectedRegionSelections] = useState<
    HospitalSearchRegionSelection[]
  >(initialFilterState.regionSelections);
  const [priceRange, setPriceRange] = useState<RangeSliderValue>(
    initialFilterState.priceRange,
  );
  const [selectedTreatmentConditionIds, setSelectedTreatmentConditionIds] =
    useState<HospitalSearchTreatmentConditionId[]>(
      initialFilterState.treatmentConditionIds,
    );
  const [isRendered, setIsRendered] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(false);
  const sheetRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const hasBeenOpenedRef = useRef(isOpen);

  useEffect(() => {
    let animationFrameId: number | undefined;
    let unmountTimeoutId: number | undefined;

    if (isOpen) {
      animationFrameId = requestAnimationFrame(() => {
        setIsRendered(true);
        animationFrameId = requestAnimationFrame(() => {
          setIsVisible(true);
        });
      });
    } else {
      animationFrameId = requestAnimationFrame(() => {
        setIsVisible(false);
        unmountTimeoutId = window.setTimeout(() => {
          setIsRendered(false);
        }, SHEET_TRANSITION_DURATION);
      });
    }

    return () => {
      if (animationFrameId !== undefined) {
        cancelAnimationFrame(animationFrameId);
      }

      if (unmountTimeoutId !== undefined) {
        window.clearTimeout(unmountTimeoutId);
      }
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isRendered) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !sheetRef.current) {
        return;
      }

      const focusableElements = Array.from(
        sheetRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );

      if (focusableElements.length === 0) {
        return;
      }

      const firstFocusableElement = focusableElements[0];
      const lastFocusableElement = focusableElements.at(-1);
      const isFocusOutsideSheet = !sheetRef.current.contains(
        document.activeElement,
      );

      if (
        event.shiftKey &&
        (isFocusOutsideSheet ||
          document.activeElement === firstFocusableElement)
      ) {
        event.preventDefault();
        lastFocusableElement?.focus();
      } else if (
        !event.shiftKey &&
        (isFocusOutsideSheet || document.activeElement === lastFocusableElement)
      ) {
        event.preventDefault();
        firstFocusableElement.focus();
      }
    };

    const previousOverflow = document.body.style.overflow;
    const rootElement = document.getElementById('root');
    const previousRootOverflow = rootElement?.style.overflow;
    document.body.style.overflow = 'hidden';
    if (rootElement) {
      rootElement.style.overflow = 'hidden';
    }
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      if (rootElement) {
        rootElement.style.overflow = previousRootOverflow ?? '';
      }
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isRendered, onClose]);

  useEffect(() => {
    if (isRendered && isOpen) {
      const animationFrameId = requestAnimationFrame(() => {
        closeButtonRef.current?.focus();
      });

      return () => cancelAnimationFrame(animationFrameId);
    }

    if (!isRendered && hasBeenOpenedRef.current) {
      const previouslyFocusedElement = triggerRef.current;

      if (previouslyFocusedElement?.isConnected) {
        previouslyFocusedElement.focus();
      }
    }
  }, [isOpen, isRendered, triggerRef]);

  const handleDistrictClick = (regionId: number, districtId: number) => {
    const selectedRegion = hospitalSearchRegions.find(
      ({ id }) => id === regionId,
    );

    if (!selectedRegion) {
      return;
    }

    const wholeDistrictId = selectedRegion.districts[0].id;
    const isWholeRegion = districtId === wholeDistrictId;

    setSelectedRegionSelections((currentSelections) => {
      const isAlreadySelected = currentSelections.some(
        (selection) => selection.districtId === districtId,
      );

      if (isAlreadySelected) {
        return currentSelections.filter(
          (selection) => selection.districtId !== districtId,
        );
      }

      const selectionsWithoutConflicts = currentSelections.filter(
        (selection) =>
          selection.regionId !== regionId ||
          (isWholeRegion ? false : selection.districtId !== wholeDistrictId),
      );

      if (selectionsWithoutConflicts.length >= MAX_SELECTED_REGION_COUNT) {
        return selectionsWithoutConflicts;
      }

      return [...selectionsWithoutConflicts, { regionId, districtId }];
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
  const priceRangeInWon = {
    min: priceRange.min * PRICE_UNIT_IN_WON,
    max: priceRange.max * PRICE_UNIT_IN_WON,
  };
  const hospitalCount = hospitalSearchItems.filter((hospital) => {
    const matchesRegion =
      selectedRegionSelections.length === 0 ||
      selectedRegionSelections.some(({ regionId, districtId }) => {
        const region = hospitalSearchRegions.find(({ id }) => id === regionId);
        const wholeDistrictId = region?.districts[0].id;

        return (
          hospital.regionId === regionId &&
          (districtId === wholeDistrictId || hospital.districtId === districtId)
        );
      });
    const matchesProcedureAndPrice = hospital.priceCards.some(
      ({ procedureId, priceAmount }) =>
        procedureIds.includes(procedureId) &&
        priceAmount >= priceRangeInWon.min &&
        priceAmount <= priceRangeInWon.max,
    );
    const matchesTreatmentConditions = selectedTreatmentConditionIds.every(
      (conditionId) => hospital.treatmentConditionIds.includes(conditionId),
    );

    return (
      matchesRegion && matchesProcedureAndPrice && matchesTreatmentConditions
    );
  }).length;
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

    if (hospitalCount === 0) {
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
              selectedRegionId={selectedRegionId}
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
                selections={selectedRegionSelections}
                onRemove={handleDistrictClick}
              />
            </div>
          </div>
        )}
        <FilterSheetBottomCta
          hospitalCount={hospitalCount}
          onReset={handleReset}
          onView={handleApply}
        />
      </section>
    </div>
  );
}

export default HospitalSearchFilterSheet;
