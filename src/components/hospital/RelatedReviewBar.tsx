type RelatedReviewBarProps = {
  reviewCount: number;
  onClick: () => void;
};

// 관련된 리뷰 바: 영역 전체가 리뷰 탭으로 이동하는 터치 영역이다.
function RelatedReviewBar({ reviewCount, onClick }: RelatedReviewBarProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-[52px] w-full items-center justify-between bg-surface-brand-weak px-padding-m py-padding-xxs"
    >
      <span className="typography-body-medium text-text-primary">
        관련된 리뷰({reviewCount})
      </span>
      <span className="typography-label-small-regular leading-[18px] font-medium text-text-tertiary">
        보러가기
      </span>
    </button>
  );
}

export default RelatedReviewBar;
