import {
  type FocusEvent as ReactFocusEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  DropdownMenu,
  DropdownMenuOption,
} from '@/components/common/DropdownMenu';
import arrowDownIcon from '@/assets/icons/arrowDown20.svg';
import dropIcon from '@/assets/icons/drop.svg';

export type MenuTriggerOption<T extends string> = {
  value: T;
  label: string;
};

type MenuTriggerProps<T extends string> = {
  label: string;
  suffix?: string;
  size: 'm' | 's';
  options?: MenuTriggerOption<T>[];
  selectedValue?: T;
  open?: boolean;
  align?: 'start' | 'end';
  onClick?: () => void;
  onOpenChange?: (open: boolean) => void;
  onValueChange?: (value: T) => void;
};

function MenuTrigger<T extends string>({
  label,
  suffix,
  size,
  options,
  selectedValue,
  open,
  align = 'start',
  onClick,
  onOpenChange,
  onValueChange,
}: MenuTriggerProps<T>) {
  const [isUncontrolledOpen, setIsUncontrolledOpen] = useState(false);
  const menuTriggerRef = useRef<HTMLDivElement>(null);
  const triggerButtonRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const hasOptions =
    size === 's' && options !== undefined && options.length > 0;
  const isOpen = open ?? isUncontrolledOpen;
  const isSheetTrigger = size === 'm' && open !== undefined;

  useEffect(() => {
    if (!hasOptions || !isOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (menuTriggerRef.current?.contains(event.target as Node)) {
        return;
      }

      if (open === undefined) {
        setIsUncontrolledOpen(false);
      }

      onOpenChange?.(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') {
        return;
      }

      if (open === undefined) {
        setIsUncontrolledOpen(false);
      }

      onOpenChange?.(false);
      triggerButtonRef.current?.focus();
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [hasOptions, isOpen, onOpenChange, open]);

  const setMenuOpen = (nextOpen: boolean) => {
    if (open === undefined) {
      setIsUncontrolledOpen(nextOpen);
    }

    onOpenChange?.(nextOpen);
  };

  const handleTriggerClick = () => {
    onClick?.();

    if (hasOptions) {
      setMenuOpen(!isOpen);
    }
  };

  const handleOptionClick = (value: T) => {
    onValueChange?.(value);
    setMenuOpen(false);
  };

  const handleFocusOut = (event: ReactFocusEvent<HTMLDivElement>) => {
    if (!hasOptions || !isOpen) {
      return;
    }

    const nextFocusedElement = event.relatedTarget;

    if (
      nextFocusedElement instanceof Node &&
      menuTriggerRef.current?.contains(nextFocusedElement)
    ) {
      return;
    }

    setMenuOpen(false);
  };

  const focusOption = (index: number) => {
    optionRefs.current[index]?.focus();
  };

  const handleTriggerKeyDown = (
    event: ReactKeyboardEvent<HTMLButtonElement>,
  ) => {
    if (!hasOptions || (event.key !== 'ArrowDown' && event.key !== 'ArrowUp')) {
      return;
    }

    event.preventDefault();
    setMenuOpen(true);

    requestAnimationFrame(() => {
      focusOption(event.key === 'ArrowDown' ? 0 : options.length - 1);
    });
  };

  const handleOptionKeyDown = (
    event: ReactKeyboardEvent<HTMLButtonElement>,
    currentIndex: number,
  ) => {
    if (!options) {
      return;
    }

    const lastIndex = options.length - 1;
    let nextIndex: number;

    switch (event.key) {
      case 'ArrowDown':
        nextIndex = currentIndex === lastIndex ? 0 : currentIndex + 1;
        break;
      case 'ArrowUp':
        nextIndex = currentIndex === 0 ? lastIndex : currentIndex - 1;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = lastIndex;
        break;
      default:
        return;
    }

    event.preventDefault();
    focusOption(nextIndex);
  };

  return (
    <div
      ref={menuTriggerRef}
      className="relative w-fit shrink-0"
      onBlur={handleFocusOut}
    >
      <button
        ref={triggerButtonRef}
        type="button"
        aria-expanded={hasOptions || isSheetTrigger ? isOpen : undefined}
        aria-haspopup={
          hasOptions ? 'menu' : isSheetTrigger ? 'dialog' : undefined
        }
        onClick={handleTriggerClick}
        onKeyDown={handleTriggerKeyDown}
        className={`flex items-center ${size === 'm' ? 'h-11 gap-gap-xs' : 'h-[34px]'}`}
      >
        {size === 'm' ? (
          <span className="whitespace-nowrap text-text-primary">
            <span className="typography-body-bold">{label}</span>
            {suffix && (
              <span className="typography-body-regular">{suffix}</span>
            )}
          </span>
        ) : (
          <span className="typography-label-small-regular whitespace-nowrap font-medium leading-[18px] text-text-secondary">
            {label}
          </span>
        )}
        <span
          className={`shrink-0 ${size === 'm' ? 'size-4' : 'size-5'} ${
            isOpen ? 'rotate-180' : ''
          }`}
        >
          <img src={size === 'm' ? dropIcon : arrowDownIcon} alt="" />
        </span>
      </button>

      {isOpen && options && (
        <DropdownMenu
          className={`absolute top-10 z-20 ${
            align === 'end' ? 'right-0' : 'left-0'
          }`}
        >
          {options.map((option, index) => (
            <DropdownMenuOption
              key={option.value}
              ref={(element) => {
                optionRefs.current[index] = element;
              }}
              label={option.label}
              selected={option.value === selectedValue}
              onClick={() => handleOptionClick(option.value)}
              onKeyDown={(event) => handleOptionKeyDown(event, index)}
            />
          ))}
        </DropdownMenu>
      )}
    </div>
  );
}

export default MenuTrigger;
