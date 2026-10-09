import type { ReactNode } from 'react';

type ToggleButtonProps = {
  selected: boolean;
  onSelectedChange: (selected: boolean) => void;
  // 20×20 영역에 들어가는 아이콘. selected 상태에 따라 바꿔 전달한다.
  icon?: ReactNode;
  children: ReactNode;
};

// ToggleButton: 누르면 On/Off 상태가 유지되는 버튼. 높이 고정, 너비는 내용에 맞추고 최소 126px.
function ToggleButton({
  selected,
  onSelectedChange,
  icon,
  children,
}: ToggleButtonProps) {
  // 켜진 상태에서는 pressed 배경색을 그대로 유지한다.
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => onSelectedChange(!selected)}
      className={`flex h-8 min-w-[126px] shrink-0 items-center justify-center gap-gap-xs rounded-[var(--radius-s)] border border-border-neutral px-padding-s typography-label-small-regular leading-[18px] font-medium whitespace-nowrap text-text-primary active:bg-interaction-neutral-inverse-pressed ${
        selected
          ? 'bg-interaction-neutral-inverse-pressed'
          : 'bg-interaction-neutral-inverse'
      }`}
    >
      {icon && (
        <span
          aria-hidden="true"
          className="flex size-5 shrink-0 items-center justify-center"
        >
          {icon}
        </span>
      )}
      {children}
    </button>
  );
}

export default ToggleButton;
