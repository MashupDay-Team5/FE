import { useEffect, useState, type CSSProperties } from 'react';
import rangeSliderTooltipPointerIcon from '@/assets/slider/rangeSliderTooltipPointer.svg';
import './RangeSlider.css';

type RangeSliderValue = {
  min: number;
  max: number;
};

type RangeSliderProps = {
  min: number;
  max: number;
  step?: number;
  value: RangeSliderValue;
  onChange: (value: RangeSliderValue) => void;
  formatValue?: (value: number) => string;
  ariaLabel?: string;
};

type RangeSliderThumb = 'min' | 'max' | null;

function RangeSlider({
  min,
  max,
  step = 1,
  value,
  onChange,
  formatValue = String,
  ariaLabel = '가격 범위',
}: RangeSliderProps) {
  const [activeThumb, setActiveThumb] = useState<RangeSliderThumb>(null);
  const valueRange = max - min;
  const lowerPercentage = ((value.min - min) / valueRange) * 100;
  const upperPercentage = ((value.max - min) / valueRange) * 100;
  const activeValue = activeThumb === 'min' ? value.min : value.max;
  const tooltipPosition =
    activeThumb === 'min' ? lowerPercentage : upperPercentage;
  const sliderStyle = {
    '--range-start': `${lowerPercentage}%`,
    '--range-width': `${upperPercentage - lowerPercentage}%`,
    '--tooltip-position': `${tooltipPosition}%`,
  } as CSSProperties;

  useEffect(() => {
    if (!activeThumb) {
      return;
    }

    const deactivateThumb = () => setActiveThumb(null);

    window.addEventListener('pointerup', deactivateThumb);
    window.addEventListener('pointercancel', deactivateThumb);

    return () => {
      window.removeEventListener('pointerup', deactivateThumb);
      window.removeEventListener('pointercancel', deactivateThumb);
    };
  }, [activeThumb]);

  const handleMinimumChange = (nextMinimum: number) => {
    onChange({ min: Math.min(nextMinimum, value.max), max: value.max });
  };

  const handleMaximumChange = (nextMaximum: number) => {
    onChange({ min: value.min, max: Math.max(nextMaximum, value.min) });
  };

  return (
    <div className="relative h-[106px] w-full select-none" style={sliderStyle}>
      {activeThumb && (
        <div className="absolute top-0 right-4 left-4">
          <div className="relative mx-3">
            <output
              aria-live="polite"
              className="absolute left-[var(--tooltip-position)] flex -translate-x-1/2 items-center justify-center rounded-[var(--radius-s)] bg-surface-subtle px-padding-xs py-padding-xxs typography-label-small-medium text-text-primary"
            >
              {formatValue(activeValue)}
              <span className="absolute -bottom-[9px] left-1/2 flex h-[11px] w-[12.3953px] -translate-x-1/2 items-center justify-center">
                <img
                  src={rangeSliderTooltipPointerIcon}
                  alt=""
                  className="-scale-y-100"
                />
              </span>
            </output>
          </div>
        </div>
      )}
      <div className="absolute top-[54px] right-4 left-4 h-1 rounded-full bg-border-neutral">
        <div className="absolute inset-y-0 right-3 left-3">
          <div
            aria-hidden="true"
            className="absolute left-[var(--range-start)] h-full w-[var(--range-width)] rounded-full bg-icon-neutral"
          />
        </div>
      </div>
      <input
        aria-label={`${ariaLabel} 최솟값`}
        className={`range-slider-input ${
          activeThumb === 'min' ||
          (activeThumb === null && value.min === value.max)
            ? 'z-20'
            : 'z-10'
        } ${activeThumb === 'min' ? 'range-slider-input-active' : ''}`}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value.min}
        onPointerDown={() => setActiveThumb('min')}
        onKeyDown={() => setActiveThumb('min')}
        onKeyUp={() => setActiveThumb(null)}
        onBlur={() => setActiveThumb(null)}
        onChange={(event) => handleMinimumChange(Number(event.target.value))}
      />
      <input
        aria-label={`${ariaLabel} 최댓값`}
        className={`range-slider-input ${
          activeThumb === 'max' ? 'z-20' : 'z-10'
        } ${activeThumb === 'max' ? 'range-slider-input-active' : ''}`}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value.max}
        onPointerDown={() => setActiveThumb('max')}
        onKeyDown={() => setActiveThumb('max')}
        onKeyUp={() => setActiveThumb(null)}
        onBlur={() => setActiveThumb(null)}
        onChange={(event) => handleMaximumChange(Number(event.target.value))}
      />
      <div className="absolute top-[70px] right-4 left-4 flex justify-between typography-label-small-medium text-text-secondary">
        <span>{formatValue(min)}</span>
        <span>{formatValue(max)}</span>
      </div>
    </div>
  );
}

export type { RangeSliderValue };
export default RangeSlider;
