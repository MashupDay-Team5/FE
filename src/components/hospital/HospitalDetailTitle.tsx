import arrowRightIcon from '@/assets/icons/arrowRight.svg';
import discountIcon from '@/assets/icons/discount.svg';
import ratingStarIcon from '@/assets/icons/ratingStar.svg';

type HospitalDetailTitleProps = {
  hospitalName: string;
  hasDiscount: boolean;
  rating: string;
  reviewCount: string;
  address: string;
  onClick?: () => void;
};

// 병원 상세 Title 영역: 영역 전체가 병원 전체 정보 페이지로 가는 터치 영역이다.
function HospitalDetailTitle({
  hospitalName,
  hasDiscount,
  rating,
  reviewCount,
  address,
  onClick,
}: HospitalDetailTitleProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full flex-col gap-px border-b border-border-neutral-strong px-padding-m pt-padding-m pb-5 text-left"
    >
      <div className="flex min-w-0 items-center gap-gap-xs">
        <div className="flex min-w-0 items-center">
          <h2 className="truncate typography-title-bold text-text-strong">
            {hospitalName}
          </h2>
          {hasDiscount && (
            <img src={discountIcon} alt="" width={20} height={20} />
          )}
        </div>
        <span className="flex size-6 shrink-0 items-center justify-center">
          <img src={arrowRightIcon} alt="" />
        </span>
      </div>

      <div className="flex min-w-0 items-center gap-gap-s">
        <div className="flex shrink-0 items-center">
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
    </button>
  );
}

export default HospitalDetailTitle;
