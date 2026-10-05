import type { ReactNode } from 'react';

export type CategoryPickerCategory<T extends string | number> = {
  id: T;
  name: string;
};

type CategoryPickerProps<T extends string | number> = {
  categories: readonly CategoryPickerCategory<T>[];
  selectedCategoryId: T;
  onCategoryChange: (categoryId: T) => void;
  children: ReactNode;
};

function CategoryPicker<T extends string | number>({
  categories,
  selectedCategoryId,
  onCategoryChange,
  children,
}: CategoryPickerProps<T>) {
  return (
    <div className="flex h-[449px] min-h-0 shrink overflow-hidden border-y border-border-neutral">
      <div className="scrollbar-hidden w-[131px] shrink-0 overflow-y-auto border-r border-border-neutral min-[376px]:w-auto min-[376px]:flex-[131_0_0]">
        {categories.map(({ id, name }) => {
          const isSelected = id === selectedCategoryId;

          return (
            <button
              key={id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onCategoryChange(id)}
              className={`flex h-[50px] w-full shrink-0 items-center p-padding-m text-left typography-label-large-medium ${
                isSelected
                  ? 'bg-surface-default text-text-brand'
                  : 'bg-surface-weak text-text-secondary'
              }`}
            >
              {name}
            </button>
          );
        })}
      </div>
      <div className="scrollbar-hidden min-w-0 flex-1 overflow-y-auto bg-surface-default min-[376px]:flex-[244_0_0]">
        {children}
      </div>
    </div>
  );
}

export default CategoryPicker;
