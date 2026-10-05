import { forwardRef } from 'react';
import filterIcon from '../../assets/icons/filter.svg';

type FilterChipProps = {
  label: string;
  selected: boolean;
  onClick: () => void;
  showIcon?: boolean;
};

const FilterChip = forwardRef<HTMLButtonElement, FilterChipProps>(
  function FilterChip({ label, selected, onClick, showIcon = false }, ref) {
    return (
      <button
        ref={ref}
        type="button"
        aria-pressed={selected}
        onClick={onClick}
        className={`inline-flex h-8 shrink-0 items-center justify-center rounded-[var(--radius-full)] border px-[var(--spacing-padding-s)] ${
          selected
            ? 'border-border-brand bg-surface-brand-weak'
            : 'border-border-neutral bg-surface-weak'
        } focus-visible:outline-2 focus-visible:outline-border-brand focus-visible:outline-offset-2`}
      >
        <span
          className={`inline-flex items-center justify-center whitespace-nowrap ${
            showIcon ? 'gap-gap-xs' : ''
          }`}
        >
          {showIcon && <img src={filterIcon} alt="" className="size-5" />}
          <span
            className={
              selected
                ? 'typography-label-small-medium text-text-primary'
                : 'typography-label-small-regular text-text-primary'
            }
          >
            {label}
          </span>
        </span>
      </button>
    );
  },
);

export default FilterChip;
