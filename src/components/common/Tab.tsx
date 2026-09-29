export type TabItem<T extends string = string> = {
  value: T;
  label: string;
  resource?: number;
};

type TabProps<T extends string> = {
  items: readonly TabItem<T>[];
  selectedValue: T;
  onValueChange: (value: T) => void;
  layout?: 'hug' | 'fill';
};

function Tab<T extends string>({
  items,
  selectedValue,
  onValueChange,
  layout = 'hug',
}: TabProps<T>) {
  const isFillLayout = layout === 'fill';

  return (
    <div className="w-full overflow-x-auto">
      <div
        className={`flex border-b border-border-neutral ${
          isFillLayout ? 'w-full' : 'min-w-max gap-gap-l'
        }`}
      >
        {items.map(({ value, label, resource }) => {
          const isSelected = value === selectedValue;
          const resourceLabel =
            resource !== undefined && resource > 0
              ? resource > 9
                ? '9+'
                : resource
              : undefined;
          const hasResource = resourceLabel !== undefined;
          const labelClassName = hasResource
            ? isSelected
              ? 'typography-body-bold'
              : 'typography-body-medium'
            : 'typography-label-large-medium';

          return (
            <button
              key={value}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onValueChange(value)}
              className={`flex h-[30px] flex-col justify-end gap-gap-xs whitespace-nowrap ${
                isFillLayout ? 'min-w-0 flex-1' : 'shrink-0'
              } ${isSelected ? 'text-text-brand' : 'text-text-disabled'}`}
            >
              <span
                className={`flex items-center justify-center gap-gap-xs ${
                  hasResource ? 'px-padding-m' : ''
                }`}
              >
                <span className={labelClassName}>{label}</span>
                {hasResource && (
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-surface-brand typography-label-small-medium text-text-brand">
                    {resourceLabel}
                  </span>
                )}
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
    </div>
  );
}

export default Tab;
