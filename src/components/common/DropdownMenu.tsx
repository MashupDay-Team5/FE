import {
  forwardRef,
  type KeyboardEventHandler,
  type ReactNode,
} from 'react';

type DropdownMenuProps = {
  children: ReactNode;
  className?: string;
};

type DropdownMenuOptionProps = {
  label: string; // '방문 많은 순'과 같은 문구
  selected?: boolean; // 현재 선택 여부
  onClick?: () => void;
  onKeyDown?: KeyboardEventHandler<HTMLButtonElement>;
};

// 드롭다운 바깥 패널
export function DropdownMenu({ children, className = '' }: DropdownMenuProps) {
  return (
    <div
      role="menu"
      className={`w-[118px] overflow-hidden rounded-[var(--radius-s)] border border-border-neutral-strong bg-surface-default shadow-[0_2px_4px_rgb(0_0_0/16%)] ${className}`}
    >
      {children}
    </div>
  );
}

// 드롭다운 옵션 한 행
export const DropdownMenuOption = forwardRef<
  HTMLButtonElement,
  DropdownMenuOptionProps
>(function DropdownMenuOption(
  { label, selected = false, onClick, onKeyDown },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      role="menuitemradio" // 여러 메뉴 항목 중 하나만 선택되는 항목
      aria-checked={selected}
      onClick={onClick}
      onKeyDown={onKeyDown}
      className={`flex h-12 w-full flex-col items-start justify-center border-b border-border-neutral bg-surface-default px-padding-s last:border-b-0 ${
        selected
          ? 'typography-label-small-regular font-medium leading-[18px] text-text-primary'
          : 'typography-label-small-regular text-text-secondary'
      }`}
    >
      {label}
    </button>
  );
});

export default DropdownMenu;
