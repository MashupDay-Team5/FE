export type SegmentControlItem<T extends string = string> = {
  value: T;
  label: string;
};

type SegmentControlProps<T extends string> = {
  items: readonly SegmentControlItem<T>[];
  selectedValue: T;
  onValueChange: (value: T) => void;
};

// SegmentControl: width 100%, 고정 높이. 각 Item은 남은 너비를 같은 비율로 나눠 갖는 터치 영역이다.
function SegmentControl<T extends string>({
  items,
  selectedValue,
  onValueChange,
}: SegmentControlProps<T>) {
  return (
    <div className="flex h-11 w-full overflow-hidden rounded-[var(--radius-s)] border border-border-neutral">
      {items.map(({ value, label }) => {
        const isSelected = value === selectedValue;

        return (
          <button
            key={value}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onValueChange(value)}
            className={`flex min-w-0 flex-1 items-center justify-center px-padding-xs typography-label-small-medium ${
              isSelected
                ? 'bg-interaction-brand text-text-inverse'
                : 'bg-surface-default text-text-primary'
            }`}
          >
            <span className="truncate">{label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default SegmentControl;
