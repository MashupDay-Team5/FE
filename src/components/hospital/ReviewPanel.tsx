import checkIcon from '@/assets/icons/check.svg';
import dividerIcon from '@/assets/icons/divider.svg';
import meatballIcon from '@/assets/icons/meatball.svg';
import ratingStarIcon from '@/assets/icons/ratingStar.svg';
import Badge from '@/components/common/Badge';
import type { HospitalReview } from '@/types/hospitalDetail';

// UserTypeBanner: 리뷰 작성자 유형 안내 띠. 현재는 일반 유저 문구만 있다.
function UserTypeBanner() {
  return (
    <p className="bg-surface-subtle py-padding-xxs text-center typography-caption-medium text-text-secondary">
      일반 모두닥 유저의 후기입니다.
    </p>
  );
}

// 인증 뱃지의 체크 아이콘은 글자색보다 연한 원래 색을 유지한다.
function CheckBadgeIcon() {
  return (
    <span
      aria-hidden="true"
      className="flex size-4 shrink-0 items-center justify-center"
    >
      <img src={checkIcon} alt="" />
    </span>
  );
}

type MainAreaProps = {
  review: HospitalReview;
};

// MainArea: 인증 뱃지, 받은 진료, 평점, 결제 금액, 본문 영역. 뱃지 줄부터 순서대로 추가한다.
function MainArea({ review }: MainAreaProps) {
  const hasBadges = review.isReceiptVerified || review.isVisitedViaModoodoc;

  return (
    <div className="flex flex-col gap-gap-l p-padding-m">
      <div className="flex flex-col gap-gap-m">
        {hasBadges && (
          <div className="flex gap-[5px]">
            {review.isReceiptVerified && (
              <Badge
                size="S"
                color="sub"
                shape="square"
                icon={<CheckBadgeIcon />}
              >
                영수증 인증
              </Badge>
            )}
            {review.isVisitedViaModoodoc && (
              <Badge
                size="S"
                color="sub"
                shape="square"
                icon={<CheckBadgeIcon />}
              >
                모두닥으로 방문
              </Badge>
            )}
          </div>
        )}

        <div className="flex justify-between">
          <div className="flex min-w-0 flex-col gap-gap-xs">
            <p className="typography-body-bold text-text-strong">
              받은 진료: {review.treatmentNames.join(', ')}
            </p>
            <div className="flex items-center gap-[10px]">
              <span className="flex items-center">
                <img src={ratingStarIcon} alt="" width={16} height={16} />
                <span className="typography-label-small-regular leading-[18px] font-medium text-text-primary">
                  {review.rating.toFixed(1)}
                </span>
              </span>
              {review.willRevisit && (
                <>
                  <img src={dividerIcon} alt="" />
                  <span className="typography-label-small-regular text-text-secondary">
                    재방문 의사 있음
                  </span>
                </>
              )}
            </div>
            {review.doctorName && (
              <p className="typography-label-small-regular text-text-secondary">
                의사: {review.doctorName}
              </p>
            )}
          </div>
          <button
            type="button"
            aria-label="리뷰 메뉴"
            className="flex size-6 shrink-0 items-center justify-center"
          >
            <img src={meatballIcon} alt="" />
          </button>
        </div>
      </div>
    </div>
  );
}

type ReviewPanelProps = {
  review: HospitalReview;
};

// ReviewPanel: 병원 상세 리뷰 탭에서만 쓰는 리뷰 카드.
// UserTypeBanner / MainArea / Profile / Callout 순서로 구성하며, 나머지 영역은 이어서 추가한다.
function ReviewPanel({ review }: ReviewPanelProps) {
  return (
    <article aria-label={`리뷰 ${review.reviewId}`}>
      <UserTypeBanner />
      <MainArea review={review} />
    </article>
  );
}

export default ReviewPanel;
