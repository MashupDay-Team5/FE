import type { HospitalReview } from '@/types/hospitalDetail';

// UserTypeBanner: 리뷰 작성자 유형 안내 띠. 현재는 일반 유저 문구만 있다.
function UserTypeBanner() {
  return (
    <p className="bg-surface-subtle py-padding-xxs text-center typography-caption-medium text-text-secondary">
      일반 모두닥 유저의 후기입니다.
    </p>
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
    </article>
  );
}

export default ReviewPanel;
