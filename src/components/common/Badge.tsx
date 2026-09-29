import type { ReactNode } from 'react';

type BadgeSize = 'L' | 'M' | 'S';
type BadgeColor = 'keyword' | 'tertiary' | 'secondary' | 'sub';
type BadgeShape = 'pill' | 'square';

type BadgeProps = {
  size: BadgeSize;
  color: BadgeColor;
  shape?: BadgeShape;
  icon?: ReactNode;
  children: ReactNode;
};

const SIZE_CLASS: Record<BadgeSize, string> = {
  L: 'h-8 px-padding-s typography-label-small-regular',
  M: 'h-[26px] px-padding-xs py-padding-xxs typography-label-small-regular',
  S: 'h-6 px-padding-xs py-padding-xxs typography-caption-medium',
};

const SHAPE_CLASS: Record<BadgeShape, string> = {
  pill: 'rounded-full',
  square: 'rounded-[var(--radius-s)]',
};

// secondary는 pill이면 진한 주황 배경, square면 연한 주황 배경을 쓴다.
function getColorClass(color: BadgeColor, shape: BadgeShape) {
  switch (color) {
    case 'keyword':
      return 'bg-surface-weak text-text-primary';
    case 'tertiary':
      return 'bg-accent-background-blue-inverse text-text-inverse';
    case 'secondary':
      return shape === 'pill'
        ? 'bg-accent-background-orange-inverse text-text-inverse'
        : 'bg-accent-background-orange text-accent-foreground-orange';
    case 'sub':
      return 'bg-surface-brand-weak text-text-brand';
  }
}

// SVG 모양만 mask로 쓰고 색은 텍스트 색(currentColor)을 따른다.
export function BadgeIcon({ src }: { src: string }) {
  return (
    <span
      aria-hidden
      className="size-4 shrink-0 bg-current mask-contain mask-center mask-no-repeat"
      style={{
        maskImage: `url("${src}")`,
        WebkitMaskImage: `url("${src}")`,
      }}
    />
  );
}

function Badge({ size, color, shape = 'pill', icon, children }: BadgeProps) {
  // Figma 기준 S pill만 아이콘과 텍스트 사이 간격이 없다.
  const gapClass = size === 'S' && shape === 'pill' ? 'gap-0' : 'gap-gap-xs';

  return (
    <span
      className={`inline-flex shrink-0 items-center whitespace-nowrap ${gapClass} ${SIZE_CLASS[size]} ${SHAPE_CLASS[shape]} ${getColorClass(color, shape)}`}
    >
      {icon}
      {children}
    </span>
  );
}

export default Badge;
