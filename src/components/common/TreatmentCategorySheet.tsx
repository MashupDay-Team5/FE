import { useCallback, useState, type RefObject } from 'react';
import { useSheetDialog } from '@/hooks/useSheetDialog';
import closeIcon from '@/assets/icons/close.svg';
import CategoryPicker from '@/components/common/CategoryPicker';
import type { MedicalCategory, TreatmentScope } from '@/types/treatment';

type TreatmentCategoryRowProps = {
  name: string;
  description?: string;
  selected: boolean;
  onClick: () => void;
};

// 우측 시술 분류 한 행: 하위 시술은 회색 요약으로 붙이고 넘치면 말줄임한다.
function TreatmentCategoryRow({
  name,
  description,
  selected,
  onClick,
}: TreatmentCategoryRowProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className="flex h-[50px] w-full shrink-0 items-center border-b border-border-weak p-padding-m text-left"
    >
      <span className="flex min-w-0 items-center">
        <span
          className={
            selected
              ? 'shrink-0 typography-label-large-medium text-text-brand'
              : 'shrink-0 typography-label-large-regular text-text-primary'
          }
        >
          {name}
        </span>
        {description && (
          <span className="truncate typography-label-small-regular text-text-tertiary">
            ({description})
          </span>
        )}
      </span>
    </button>
  );
}

type TreatmentCategorySheetProps = {
  isOpen: boolean;
  categories: MedicalCategory[];
  selectedScope: TreatmentScope;
  onSelect: (scope: TreatmentScope) => void;
  onClose: () => void;
  triggerRef: RefObject<HTMLElement | null>;
  topOffset?: string;
};

function TreatmentCategorySheet({
  isOpen,
  categories,
  selectedScope,
  onSelect,
  onClose,
  triggerRef,
  topOffset,
}: TreatmentCategorySheetProps) {
  const [browsingCategoryId, setBrowsingCategoryId] = useState(
    selectedScope.medicalCategoryId,
  );
  const resetBrowsingCategory = useCallback(() => {
    setBrowsingCategoryId(selectedScope.medicalCategoryId);
  }, [selectedScope.medicalCategoryId]);
  const { isRendered, isVisible, sheetRef, closeButtonRef } = useSheetDialog({
    isOpen,
    onClose,
    triggerRef,
    onOpen: resetBrowsingCategory,
  });

  if (!isRendered) {
    return null;
  }

  const browsingCategory =
    categories.find(({ id }) => id === browsingCategoryId) ?? categories[0];
  const isBrowsingSelectedCategory =
    browsingCategory.id === selectedScope.medicalCategoryId;

  const handleSelect = (treatmentCategoryId: number | null) => {
    onSelect({ medicalCategoryId: browsingCategory.id, treatmentCategoryId });
    onClose();
  };

  return (
    <div
      style={{ top: topOffset ?? 0 }}
      className={`fixed bottom-0 left-1/2 z-20 flex w-full max-w-[480px] -translate-x-1/2 flex-col items-center justify-end bg-black/70 ${
        topOffset ? '' : 'pt-[140px]'
      } transition-opacity duration-200 motion-reduce:transition-none ${
        isVisible ? 'opacity-100 ease-out' : 'opacity-0 ease-in'
      }`}
      onMouseDown={onClose}
    >
      <section
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="treatment-category-sheet-title"
        className={`flex max-h-full w-full max-w-[480px] shrink-0 flex-col overflow-hidden rounded-t-[var(--radius-l)] bg-surface-default pb-[env(safe-area-inset-bottom)] transition-transform duration-[400ms] motion-reduce:transition-none ${
          isVisible
            ? 'translate-y-0 ease-[cubic-bezier(0,0,0.4,1)]'
            : 'translate-y-full ease-in'
        }`}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="flex h-[60px] shrink-0 items-center justify-between bg-surface-default py-padding-xs pr-padding-s pl-padding-m">
          <h2
            id="treatment-category-sheet-title"
            className="typography-headline-bold text-text-primary"
          >
            원하는 치료를 선택해주세요
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            aria-label="치료 선택 닫기"
            onClick={onClose}
            className="flex size-11 shrink-0 items-center justify-center"
          >
            <img src={closeIcon} alt="" width={24} height={24} />
          </button>
        </header>
        <CategoryPicker
          categories={categories}
          selectedCategoryId={browsingCategory.id}
          onCategoryChange={setBrowsingCategoryId}
          categoryWidth={136}
          unselectedCategoryWeight="regular"
        >
          <TreatmentCategoryRow
            name="전체"
            selected={
              isBrowsingSelectedCategory &&
              selectedScope.treatmentCategoryId === null
            }
            onClick={() => handleSelect(null)}
          />
          {browsingCategory.treatmentCategories.map(
            ({ id, name, treatments }) => (
              <TreatmentCategoryRow
                key={id}
                name={name}
                description={
                  treatments.length > 0
                    ? treatments.map((treatment) => treatment.name).join('/')
                    : undefined
                }
                selected={
                  isBrowsingSelectedCategory &&
                  selectedScope.treatmentCategoryId === id
                }
                onClick={() => handleSelect(id)}
              />
            ),
          )}
        </CategoryPicker>
      </section>
    </div>
  );
}

export default TreatmentCategorySheet;
