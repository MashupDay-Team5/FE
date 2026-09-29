import type { ReactNode } from 'react';

type PriceCardProps = {
  type: 'badge' | 'default' | 'free';
  width?: 'fill' | 'fixed';
  procedureName: string;
  originalPrice: string;
  discountedPrice?: string;
  originalPriceLabel?: string;
  badge?: ReactNode;
  className?: string;
};

function PriceCard({
  type,
  width = 'fill',
  procedureName,
  originalPrice,
  discountedPrice,
  originalPriceLabel = '정상가',
  badge,
  className,
}: PriceCardProps) {
  const isFree = type === 'free';
  const cardHeightClassName = isFree ? 'h-[84px]' : 'h-[120px]';

  return (
    <article
      className={`flex ${cardHeightClassName} min-w-[220px] flex-col overflow-hidden rounded-[var(--radius-s)] border-[0.5px] border-border-brand ${
        width === 'fill' ? 'w-full' : 'w-[220px] shrink-0'
      } ${className ?? ''}`}
    >
      <div className="flex h-10 items-center justify-between bg-surface-brand-weak px-padding-s py-padding-xs">
        <h3 className="typography-body-medium text-text-primary">
          {procedureName}
        </h3>
        {type === 'badge' && badge}
      </div>

      <div
        className={`flex flex-1 p-padding-s ${
          !isFree
            ? 'flex-col gap-gap-s'
            : 'items-center justify-between typography-label-small-regular text-text-tertiary'
        }`}
      >
        <div className="flex w-full items-center justify-between typography-label-small-regular text-text-tertiary">
          <span className="typography-label-small-medium">
            {originalPriceLabel}
          </span>
          <span>{originalPrice}</span>
        </div>
        {!isFree && (
          <>
            <div className="border-t border-border-neutral" />
            <div className="flex items-center justify-between text-text-primary">
              <span className="typography-label-small-medium">
                대학생 할인가
              </span>
              <strong className="typography-label-large-medium">
                {discountedPrice}
              </strong>
            </div>
          </>
        )}
      </div>
    </article>
  );
}

export default PriceCard;
