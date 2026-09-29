import type { ReactNode } from 'react';
import bookmarkIcon from '@/assets/icons/bookmark28.svg';
import discountIcon from '@/assets/icons/discount.svg';
import ratingStarIcon from '@/assets/icons/ratingStar.svg';

type ListCardProps = {
  hospitalName: string;
  rating: string;
  reviewCount: string;
  address: string;
  priceCards: ReactNode;
  thumbnailUrl?: string;
  badges?: ReactNode;
  showDiscountIcon?: boolean;
  onBookmarkClick?: () => void;
};

function ListCard({
  hospitalName,
  rating,
  reviewCount,
  address,
  priceCards,
  thumbnailUrl,
  badges,
  showDiscountIcon = true,
  onBookmarkClick,
}: ListCardProps) {
  return (
    <article className="flex w-full flex-col gap-gap-l overflow-hidden border-b border-border-neutral bg-surface-default py-padding-l">
      <div className="flex flex-col gap-gap-s px-padding-m">
        {badges && <div className="flex gap-gap-xs">{badges}</div>}

        <div className="relative flex items-start">
          <div className="flex min-w-0 items-center gap-gap-m pr-11">
            <div className="size-[52px] shrink-0 overflow-hidden rounded-[var(--radius-s)] bg-surface-weak">
              {thumbnailUrl && (
                <img
                  src={thumbnailUrl}
                  alt=""
                  className="size-full object-cover"
                />
              )}
            </div>

            <div className="flex min-w-0 flex-col gap-px">
              <div className="flex items-center">
                <h3 className="truncate typography-headline-bold text-text-strong">
                  {hospitalName}
                </h3>
                {showDiscountIcon && (
                  <img src={discountIcon} alt="" width={20} height={20} />
                )}
              </div>

              <div className="flex items-center gap-gap-s">
                <div className="flex items-center">
                  <img src={ratingStarIcon} alt="" width={16} height={16} />
                  <span className="typography-label-small-medium text-text-primary">
                    {rating}({reviewCount})
                  </span>
                </div>
                <span
                  aria-hidden="true"
                  className="h-3 border-l border-border-neutral"
                />
                <span className="truncate typography-label-small-medium text-text-secondary">
                  {address}
                </span>
              </div>
            </div>
          </div>

          {onBookmarkClick ? (
            <button
              type="button"
              aria-label={`${hospitalName} 저장`}
              onClick={onBookmarkClick}
              className="absolute -top-padding-xs -right-padding-xs flex size-11 items-center justify-center"
            >
              <img src={bookmarkIcon} alt="" />
            </button>
          ) : (
            <span
              aria-hidden="true"
              className="absolute -top-padding-xs -right-padding-xs flex size-11 items-center justify-center"
            >
              <img src={bookmarkIcon} alt="" />
            </span>
          )}
        </div>
      </div>

      <div className="flex w-full items-center gap-gap-s overflow-x-auto overflow-y-hidden px-padding-m [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {priceCards}
        <div aria-hidden="true" className="h-8 w-4 shrink-0" />
      </div>
    </article>
  );
}

export default ListCard;
