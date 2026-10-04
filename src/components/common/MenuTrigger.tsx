import { useState } from 'react';
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
  const hasOptions =
    size === 's' && options !== undefined && options.length > 0;
  const isOpen = open ?? isUncontrolledOpen;

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

  return (
    <div className="relative w-fit shrink-0">
      <button
        type="button"
        aria-expanded={hasOptions ? isOpen : undefined}
        aria-haspopup={hasOptions ? 'menu' : undefined}
        onClick={handleTriggerClick}
        className={`flex items-center ${size === 'm' ? 'h-11 gap-gap-xs' : 'h-9'}`}
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
          {options.map((option) => (
            <DropdownMenuOption
              key={option.value}
              label={option.label}
              selected={option.value === selectedValue}
              onClick={() => handleOptionClick(option.value)}
            />
          ))}
        </DropdownMenu>
      )}
    </div>
  );
}

export default MenuTrigger;
