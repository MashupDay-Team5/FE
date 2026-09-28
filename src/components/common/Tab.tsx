export type TabItem<T extends string = string> = {
  value: T;
  label: string;
};

type TabProps<T extends string> = {
  items: readonly TabItem<T>[];
  selectedValue: T;
  onValueChange: (value: T) => void;
  layout?: 'hug' | 'fill';
  ariaLabel?: string;
};

function Tab<T extends string>({
  items,
  selectedValue,
  onValueChange,
  layout = 'hug',
  ariaLabel = '탭',
}: TabProps<T>) {
  const isFillLayout = layout === 'fill';

  return (
    <div className="w-full overflow-x-auto">
      <div
        role="tablist"
        aria-label={ariaLabel}
        className={`flex border-b border-border-neutral ${
          isFillLayout ? 'w-full' : 'min-w-max gap-gap-l'
        }`}
      >
        {items.map(({ value, label }) => {
          const isSelected = value === selectedValue;

          return (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => onValueChange(value)}
              className={`flex h-[30px] flex-col justify-end gap-gap-xs whitespace-nowrap ${
                isFillLayout ? 'min-w-0 flex-1' : 'shrink-0'
              } ${isSelected ? 'text-text-brand' : 'text-text-disabled'}`}
            >
              <span className="typography-label-large-medium">{label}</span>
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
    </div>
  );
}

export default Tab;
