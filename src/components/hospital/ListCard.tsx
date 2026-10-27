import {
  Children,
  useRef,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import bookmarkIcon from '@/assets/icons/bookmark28.svg';
import checkBadgeIcon from '@/assets/icons/checkBadgeIcon.svg';
import discountIcon from '@/assets/icons/discount.svg';
import ratingStarIcon from '@/assets/icons/ratingStar.svg';
import Badge, { BadgeIcon } from '@/components/common/Badge';
import { hospitalAvailabilityBadgeLabels } from '@/constants/hospitalSearch';
import type { HospitalAvailabilityBadge } from '@/types/hospitalSearch';

// 이만큼 이상 움직였다가 뗀 경우는 드래그(스크롤)로 보고 상세로 이동하지 않는다.
const CARD_DRAG_THRESHOLD = 8;

type ListCardProps = {
  hospitalName: string;
  rating: string;
  reviewCount: string;
  address: string;
  priceCards: ReactNode;
  thumbnailUrl?: string;
  isPopular?: boolean;
  availabilityBadges?: HospitalAvailabilityBadge[];
  badges?: ReactNode;
  showDiscountIcon?: boolean;
  // 있으면 카드 전체(병원명·사진·가격 카드 등)를 눌러 상세 화면으로 이동한다.
  detailPath?: string;
  onBookmarkClick?: () => void;
};

function ListCard({
  hospitalName,
  rating,
  reviewCount,
  address,
  priceCards,
  thumbnailUrl,
  isPopular = false,
  availabilityBadges = [],
  badges,
  showDiscountIcon = false,
  detailPath,
  onBookmarkClick,
}: ListCardProps) {
  const thumbnailClassName =
    'size-[52px] shrink-0 overflow-hidden rounded-[var(--radius-s)] bg-surface-weak';
  const thumbnail = thumbnailUrl && (
    <img src={thumbnailUrl} alt="" className="size-full object-cover" />
  );
  const hasBadges = isPopular || availabilityBadges.length > 0 || badges;
  const navigate = useNavigate();
  const pointerStartRef = useRef<{ x: number; y: number } | null>(null);

  const handlePointerDown = (event: PointerEvent<HTMLElement>) => {
    pointerStartRef.current = { x: event.clientX, y: event.clientY };
  };

  // 링크·버튼(북마크)을 누른 경우, 가격 카드를 끌어서 넘긴 경우, 글자를 선택한 경우는 이동하지 않는다.
  const handleCardClick = (event: MouseEvent<HTMLElement>) => {
    if (!detailPath) return;

    const target = event.target as HTMLElement;
    if (target.closest('a, button, [data-card-click-ignore]')) return;

    const start = pointerStartRef.current;
    if (
      start &&
      Math.hypot(event.clientX - start.x, event.clientY - start.y) >
        CARD_DRAG_THRESHOLD
    ) {
      return;
    }

    if (window.getSelection()?.toString()) return;

    navigate(detailPath);
  };

  return (
    <article
      onPointerDown={detailPath ? handlePointerDown : undefined}
      onClick={detailPath ? handleCardClick : undefined}
      className={`flex w-full flex-col gap-gap-l overflow-hidden border-b border-border-weak bg-surface-default py-padding-l ${
        detailPath ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex flex-col gap-gap-s px-padding-m">
        {hasBadges && (
          <div className="flex flex-wrap gap-gap-xs">
            {isPopular && (
              <Badge size="S" color="sub" shape="square">
                인기 병원
              </Badge>
            )}
            {availabilityBadges.map((badge) => (
              <Badge
                key={badge}
                size="S"
                color="secondary"
                shape="square"
                icon={<BadgeIcon src={checkBadgeIcon} />}
              >
                {hospitalAvailabilityBadgeLabels[badge]}
              </Badge>
            ))}
            {badges}
          </div>
        )}

        <div className="relative flex items-start">
          <div className="flex min-w-0 items-center gap-gap-m pr-11">
            {detailPath ? (
              // 병원명 링크와 같은 곳으로 이동하므로 키보드·스크린리더에서는 중복되지 않게 숨긴다.
              <Link
                to={detailPath}
                tabIndex={-1}
                aria-hidden="true"
                className={thumbnailClassName}
              >
                {thumbnail}
              </Link>
            ) : (
              <div className={thumbnailClassName}>{thumbnail}</div>
            )}

            <div className="flex min-w-0 flex-col gap-px">
              <div className="flex items-center">
                <h3 className="truncate typography-headline-bold text-text-strong">
                  {detailPath ? (
                    <Link
                      to={detailPath}
                      className="rounded-[var(--radius-s)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-brand"
                    >
                      {hospitalName}
                    </Link>
                  ) : (
                    hospitalName
                  )}
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
              data-card-click-ignore
              className="absolute -top-padding-xs -right-padding-xs flex size-11 items-center justify-center"
            >
              <img src={bookmarkIcon} alt="" />
            </span>
          )}
        </div>
      </div>

      <div className="flex w-full items-center gap-gap-s overflow-x-auto overflow-y-hidden px-padding-m [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {priceCards}
        {Children.count(priceCards) > 1 && (
          <div aria-hidden="true" className="h-8 w-4 shrink-0" />
        )}
      </div>
    </article>
  );
}

export default ListCard;
