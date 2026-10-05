import { useEffect, useState } from 'react';
import closeIcon from '@/assets/icons/close.svg';
import CategoryPicker from '@/components/common/CategoryPicker';
import { hospitalSearchRegions } from '@/mocks/hospitalSearch';
import type { HospitalSearchIntegratedFilterCategory } from '@/types/hospitalSearch';

const SHEET_TRANSITION_DURATION = 400;

const filterCategoryTabs = [
  { value: 'region', label: '지역' },
  { value: 'price', label: '가격' },
  { value: 'treatment-condition', label: '진료조건' },
] as const;

type FilterCategoryTabsProps = {
  selectedValue: HospitalSearchIntegratedFilterCategory;
  onValueChange: (value: HospitalSearchIntegratedFilterCategory) => void;
};

function FilterCategoryTabs({
  selectedValue,
  onValueChange,
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
            <span>{label}</span>
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
  onRegionChange: (regionId: number) => void;
};

function FilterRegionPanel({
  selectedRegionId,
  onRegionChange,
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
      {selectedRegion.districts.map(({ id, name }) => (
        <button
          key={id}
          type="button"
          className="flex h-[51px] w-full shrink-0 items-center border-b border-border-neutral p-padding-m text-left typography-label-large-regular text-text-primary"
        >
          {name}
        </button>
      ))}
    </CategoryPicker>
  );
}

type FilterSheetBottomCtaProps = {
  hospitalCount: number;
};

function FilterSheetBottomCta({ hospitalCount }: FilterSheetBottomCtaProps) {
  const isViewButtonEnabled = hospitalCount > 0;

  return (
    <div className="mt-auto shrink-0 bg-surface-default">
      <div className="mx-auto flex w-full max-w-[375px] items-center gap-gap-s px-padding-m py-padding-xs min-[376px]:max-w-none">
        <button
          type="button"
          className="flex h-[52px] w-[119px] shrink-0 flex-col items-center justify-center gap-gap-xs rounded-[var(--radius-s)] border border-border-brand bg-surface-default px-padding-m py-padding-s text-center typography-label-large-medium text-text-brand min-[376px]:w-auto min-[376px]:flex-[119_0_0]"
        >
          초기화
        </button>
        <button
          type="button"
          disabled={!isViewButtonEnabled}
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
};

function HospitalSearchFilterSheet({
  isOpen,
  onClose,
}: HospitalSearchFilterSheetProps) {
  const [selectedCategory, setSelectedCategory] =
    useState<HospitalSearchIntegratedFilterCategory>('region');
  const [selectedRegionId, setSelectedRegionId] = useState(
    hospitalSearchRegions[0].id,
  );
  const [isRendered, setIsRendered] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(false);

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
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isRendered, onClose]);

  if (!isRendered) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-20 flex w-full flex-col items-center justify-end bg-black/70 pt-[140px] transition-opacity duration-200 motion-reduce:transition-none ${
        isVisible ? 'opacity-100 ease-out' : 'opacity-0 ease-in'
      }`}
      onMouseDown={onClose}
    >
      <section
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
        />
        {selectedCategory === 'region' && (
          <FilterRegionPanel
            selectedRegionId={selectedRegionId}
            onRegionChange={setSelectedRegionId}
          />
        )}
        <FilterSheetBottomCta hospitalCount={0} />
      </section>
    </div>
  );
}

export default HospitalSearchFilterSheet;
