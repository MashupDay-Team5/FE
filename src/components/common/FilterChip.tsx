import filterIcon from '../../assets/icons/filter.svg';

type FilterChipProps = {
  label: string;
  selected: boolean;
  onClick: () => void;
  showIcon?: boolean;
};

function FilterChip({
  label,
  selected,
  onClick,
  showIcon = false,
}: FilterChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`inline-flex h-8 shrink-0 items-center justify-center rounded-[var(--radius-full)] border px-[var(--spacing-padding-s)] ${
        selected
          ? 'border-border-brand bg-surface-brand-weak'
          : 'border-border-neutral bg-surface-weak'
      }`}
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
}

export default FilterChip;
