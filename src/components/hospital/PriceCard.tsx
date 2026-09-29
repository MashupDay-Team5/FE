import badgeDiscountIcon from '@/assets/icons/badgeDiscount.svg';
import Badge from '@/components/common/Badge';

type PriceCardBaseProps = {
  width?: 'fill' | 'fixed';
  procedureName: string;
  originalPrice: string;
  originalPriceLabel?: string;
  className?: string;
};

type PriceCardProps =
  | (PriceCardBaseProps & {
      type: 'badge';
      discountedPrice: string;
      badgeLabel: string;
    })
  | (PriceCardBaseProps & {
      type: 'default';
      discountedPrice: string;
      badgeLabel?: never;
    })
  | (PriceCardBaseProps & {
      type: 'free';
      discountedPrice?: never;
      badgeLabel?: never;
    });

function PriceCard({
  type,
  width = 'fill',
  procedureName,
  originalPrice,
  discountedPrice,
  originalPriceLabel = '정상가',
  badgeLabel,
  className,
}: PriceCardProps) {
  const cardHeightClassName = type === 'free' ? 'h-[84px]' : 'h-[120px]';

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
        {type === 'badge' && (
          <Badge
            size="S"
            color="secondary"
            icon={<img src={badgeDiscountIcon} alt="" />}
          >
            {badgeLabel}
          </Badge>
        )}
      </div>

      <div
        className={`flex flex-1 p-padding-s ${
          type !== 'free'
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
        {type !== 'free' && (
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
