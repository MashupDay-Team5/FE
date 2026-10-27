import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import bookmarkIcon from '@/assets/icons/bookmark28.svg';
import messageIcon from '@/assets/icons/message.svg';
import MenuTrigger, {
  type MenuTriggerOption,
} from '@/components/common/MenuTrigger';
import SegmentControl, {
  type SegmentControlItem,
} from '@/components/common/SegmentControl';
import Tab, { type TabItem } from '@/components/common/Tab';
import HospitalDetailTitle from '@/components/hospital/HospitalDetailTitle';
import RelatedReviewBar from '@/components/hospital/RelatedReviewBar';
import ReviewKeywords from '@/components/hospital/ReviewKeywords';
import ScrollToTopButton from '@/components/hospital/ScrollToTopButton';
import ReviewPanel from '@/components/hospital/ReviewPanel';
import Header from '@/components/layout/Header';
import TopArea from '@/components/layout/TopArea';
import { useHospitalDetail } from '@/hooks/useHospitalDetail';
import { useHospitalReviews } from '@/hooks/useHospitalReviews';
import type {
  HospitalDetailTab,
  HospitalReviewSegment,
  HospitalReviewSort,
} from '@/types/hospitalDetail';

const reviewSortOptions: MenuTriggerOption<HospitalReviewSort>[] = [
  { value: 'default', label: '기본순' },
  { value: 'latest', label: '최신순' },
  { value: 'highest-rating', label: '높은평점순' },
  { value: 'lowest-rating', label: '낮은평점순' },
  { value: 'most-helpful', label: '도움많은순' },
];

// 관련 리뷰가 이 수보다 적으면 키워드를 공개하지 않고 관련된 리뷰 바도 숨긴다.
const MIN_RELATED_REVIEW_COUNT = 10;

// Detail Header 높이. 대표 이미지가 이만큼 Header 뒤로 지나가면 Header 배경을 보여준다.
const HEADER_HEIGHT = 52;

const STATUS_TEXT_CLASS =
  'py-padding-l text-center typography-body-medium text-text-secondary';
const OUTLINE_BUTTON_CLASS =
  'flex h-11 w-full items-center justify-center rounded-[var(--radius-s)] border border-border-neutral bg-surface-default typography-body-medium text-text-primary';

type RetryMessageProps = {
  message: string;
  onRetry: () => void;
};

// 불러오기 실패 안내와 다시 시도 버튼
function RetryMessage({ message, onRetry }: RetryMessageProps) {
  return (
    <div className="flex flex-col items-center gap-gap-s px-padding-m py-padding-l">
      <p role="alert" className="typography-body-medium text-text-secondary">
        {message}
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="rounded-[var(--radius-s)] border border-border-neutral px-padding-m py-padding-xs typography-label-small-medium text-text-primary"
      >
        다시 시도
      </button>
    </div>
  );
}

function HospitalDetailPage() {
  const params = useParams();
  const hospitalId = Number(params.hospitalId);
  const treatmentId = Number(params.treatmentId);
  const navigate = useNavigate();
  const location = useLocation();
  const detail = useHospitalDetail(hospitalId, treatmentId);
  const hospital = detail.status === 'success' ? detail.hospital : null;
  const isHospitalLoaded = hospital !== null;
  const heroImageRef = useRef<HTMLDivElement>(null);
  const reviewSectionRef = useRef<HTMLElement>(null);
  const [isHeroVisible, setHeroVisible] = useState(true);
  const [selectedTab, setSelectedTab] = useState<HospitalDetailTab>('review');
  const [selectedSegment, setSelectedSegment] =
    useState<HospitalReviewSegment>('related');
  const [selectedSort, setSelectedSort] =
    useState<HospitalReviewSort>('default');
  // '도움이 돼요' API가 없어 누른 리뷰 ID를 화면에서만 관리한다.
  const [helpfulReviewIds, setHelpfulReviewIds] = useState<Set<number>>(
    () => new Set(),
  );
  const reviewList = useHospitalReviews({
    hospitalId,
    treatmentId,
    segment: selectedSegment,
    sort: selectedSort,
    enabled: isHospitalLoaded,
  });

  // 대표 이미지가 Header 뒤로 완전히 지나가면 Header 배경과 타이틀을 보여준다.
  useEffect(() => {
    const heroImage = heroImageRef.current;
    if (!heroImage) return;

    const observer = new IntersectionObserver(
      ([entry]) => setHeroVisible(entry.isIntersecting),
      { rootMargin: `-${HEADER_HEIGHT}px 0px 0px 0px` },
    );
    observer.observe(heroImage);

    return () => observer.disconnect();
  }, [isHospitalLoaded]);

  // 앱 안에서 들어왔으면 이전 화면으로, 주소로 바로 들어왔으면(이전 기록 없음) 홈으로 이동한다.
  const handleBackClick = () => {
    if (location.key === 'default') {
      navigate('/mall/university', { replace: true });
      return;
    }

    navigate(-1);
  };

  const handleHomeClick = () => navigate('/mall/university');

  if (!hospital) {
    return (
      <>
        <TopArea>
          <Header
            type="Detail"
            title=""
            onBackClick={handleBackClick}
            onHomeClick={handleHomeClick}
          />
        </TopArea>
        {detail.status === 'loading' && (
          <p role="status" className={STATUS_TEXT_CLASS}>
            병원 정보를 불러오는 중이에요.
          </p>
        )}
        {detail.status === 'not-found' && (
          <p className={STATUS_TEXT_CLASS}>병원 정보를 찾을 수 없어요.</p>
        )}
        {detail.status === 'error' && (
          <RetryMessage
            message="병원 정보를 불러오지 못했어요."
            onRetry={detail.retry}
          />
        )}
      </>
    );
  }

  // 가격·Q&A 탭은 디자인 확정 전까지 비활성화한다. Q&A 수는 API에 없어 표시하지 않는다.
  const tabItems: TabItem<HospitalDetailTab>[] = [
    { value: 'price', label: '가격', disabled: true },
    {
      value: 'review',
      label: `리뷰(${hospital.relatedReviewCount + hospital.otherReviewCount})`,
    },
    { value: 'qna', label: 'Q&A', disabled: true },
  ];
  const segmentItems: SegmentControlItem<HospitalReviewSegment>[] = [
    { value: 'related', label: `관련 리뷰 (${hospital.relatedReviewCount})` },
    {
      value: 'other',
      label: `이 병원의 다른 리뷰(${hospital.otherReviewCount})`,
    },
  ];

  const hasEnoughRelatedReviews =
    hospital.relatedReviewCount >= MIN_RELATED_REVIEW_COUNT;
  const selectedSortOption =
    reviewSortOptions.find(({ value }) => value === selectedSort) ??
    reviewSortOptions[0];
  const selectedSegmentReviewCount =
    selectedSegment === 'related'
      ? hospital.relatedReviewCount
      : hospital.otherReviewCount;

  // 관련된 리뷰 바: 리뷰 탭·관련 리뷰를 선택하고 탭이 Header 아래에 붙는 위치로 스크롤한다.
  const handleRelatedReviewClick = () => {
    setSelectedTab('review');
    setSelectedSegment('related');
    reviewSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleHelpfulChange = (reviewId: number, isHelpful: boolean) => {
    setHelpfulReviewIds((previous) => {
      const next = new Set(previous);
      if (isHelpful) {
        next.add(reviewId);
      } else {
        next.delete(reviewId);
      }
      return next;
    });
  };

  return (
    <>
      <TopArea transparent={isHeroVisible}>
        <Header
          type="Detail"
          title={hospital.hospitalName}
          transparent={isHeroVisible}
          onBackClick={handleBackClick}
          onHomeClick={handleHomeClick}
        />
      </TopArea>

      {/* 마지막 콘텐츠가 하단 CTA와 맨 위로 버튼(40px + 간격 20px)에 가려지지 않도록 여백을 둔다. */}
      <div className="-mx-padding-m pb-[calc(116px+max(14px,calc(var(--spacing-padding-xxs)+env(safe-area-inset-bottom))))]">
        {/* 대표 이미지는 Header 아래까지 끌어올려 Header가 이미지 위에 겹치게 한다. */}
        <div
          ref={heroImageRef}
          className="-mt-[calc(52px+env(safe-area-inset-top))] aspect-[375/216] w-full bg-surface-weak"
        >
          {/* 대표 이미지는 API에 아직 없어 placeholder만 보여준다. */}
        </div>

        <HospitalDetailTitle
          hospitalName={hospital.hospitalName}
          hasDiscount={hospital.hasDiscount}
          rating={hospital.rating}
          reviewCount={hospital.reviewCount}
          address={hospital.address}
        />

        <section className="flex flex-col gap-gap-xs p-padding-m">
          <div className="flex h-11 items-center justify-between">
            <h2 className="typography-heading-bold text-text-primary">
              {hospital.treatment.name}
            </h2>
            {/* 채워진 북마크 시안이 확정되면 저장 상태 토글을 연결한다. */}
            <button
              type="button"
              aria-label={`${hospital.treatment.name} 저장`}
              className="flex size-11 shrink-0 items-center justify-center"
            >
              <img src={bookmarkIcon} alt="" width={28} height={28} />
            </button>
          </div>
          {/* 프로모션 캡션 줄은 API에 문구가 생기면 다시 추가한다. */}
          <ReviewKeywords
            keywords={detail.keywords}
            isLocked={!hasEnoughRelatedReviews}
          />
        </section>

        {hasEnoughRelatedReviews && (
          <RelatedReviewBar
            reviewCount={hospital.relatedReviewCount}
            onClick={handleRelatedReviewClick}
          />
        )}

        {/* 관련된 리뷰 바와 탭 사이 24px. 스크롤 이동 시 탭이 Header 아래에 오도록 여백을 둔다. */}
        <section
          ref={reviewSectionRef}
          className="mt-padding-l scroll-mt-[calc(env(safe-area-inset-top)+52px)]"
        >
          {/* 탭은 스크롤 시 Header 바로 아래에 고정한다. */}
          <div className="sticky top-[calc(env(safe-area-inset-top)+52px)] z-[5] bg-surface-default pt-padding-xs">
            <Tab
              items={tabItems}
              selectedValue={selectedTab}
              onValueChange={setSelectedTab}
              layout="fill"
            />
          </div>
          <div className="px-padding-m py-padding-m">
            <SegmentControl
              items={segmentItems}
              selectedValue={selectedSegment}
              onValueChange={setSelectedSegment}
            />
          </div>
          {/* 리뷰 헤더 */}
          <div className="flex items-center justify-between p-padding-m">
            <h2 className="flex items-center gap-gap-xs typography-heading-bold">
              <span className="text-text-strong">
                {hospital.treatment.name} 리뷰
              </span>
              <span className="text-text-brand">
                {selectedSegmentReviewCount}
              </span>
            </h2>
            <MenuTrigger<HospitalReviewSort>
              label={selectedSortOption.label}
              size="s"
              options={reviewSortOptions}
              selectedValue={selectedSort}
              align="end"
              onValueChange={setSelectedSort}
            />
          </div>
          {reviewList.status === 'loading' && (
            <p role="status" className={STATUS_TEXT_CLASS}>
              리뷰를 불러오는 중이에요.
            </p>
          )}
          {reviewList.status === 'error' && (
            <RetryMessage
              message="리뷰를 불러오지 못했어요."
              onRetry={reviewList.retry}
            />
          )}
          {reviewList.status === 'success' &&
            reviewList.reviews.length === 0 && (
              <p className={STATUS_TEXT_CLASS}>아직 리뷰가 없어요.</p>
            )}
          {/* 리뷰 카드 사이 16px은 Figma 시안 간격을 재서 맞춘 값이다. */}
          {reviewList.status === 'success' && reviewList.reviews.length > 0 && (
            <div className="flex flex-col gap-gap-l">
              {reviewList.reviews.map((review) => (
                <ReviewPanel
                  key={review.reviewId}
                  review={review}
                  isHelpful={helpfulReviewIds.has(review.reviewId)}
                  onHelpfulChange={(isHelpful) =>
                    handleHelpfulChange(review.reviewId, isHelpful)
                  }
                />
              ))}
            </div>
          )}
          {reviewList.status === 'success' && reviewList.hasNext && (
            <div className="px-padding-m pt-padding-l">
              {reviewList.loadMoreStatus === 'error' && (
                <p
                  role="alert"
                  className="pb-padding-xs text-center typography-label-small-medium text-text-secondary"
                >
                  리뷰를 더 불러오지 못했어요. 다시 눌러 주세요.
                </p>
              )}
              <button
                type="button"
                onClick={reviewList.loadMore}
                disabled={reviewList.loadMoreStatus === 'loading'}
                aria-busy={reviewList.loadMoreStatus === 'loading'}
                className={OUTLINE_BUTTON_CLASS}
              >
                {reviewList.loadMoreStatus === 'loading'
                  ? '불러오는 중'
                  : '더보기'}
              </button>
            </div>
          )}
        </section>
      </div>

      {/* 맨 위로 버튼: 하단 CTA 영역(위 패딩 4 + 버튼 52 + 아래 패딩) 위 20px, 오른쪽 16px.
          고정 탭(z-5)보다 앞에 보이도록 z-10을 준다. */}
      <div className="pointer-events-none fixed inset-x-0 z-10 bottom-[calc(76px+max(14px,calc(var(--spacing-padding-xxs)+env(safe-area-inset-bottom))))] mx-auto flex w-full max-w-[480px] justify-end px-padding-m">
        <ScrollToTopButton visibility="afterScroll" />
      </div>

      {/* 하단 CTA: 위 패딩 4px, 아래 패딩은 Figma 기준 safe area를 포함해 14px(4px + 10px)이다. */}
      <div className="fixed inset-x-0 bottom-0 z-10 mx-auto grid w-full max-w-[480px] grid-cols-2 gap-gap-s bg-surface-default px-padding-m pt-padding-xxs pb-[max(14px,calc(var(--spacing-padding-xxs)+env(safe-area-inset-bottom)))]">
        <button
          type="button"
          className="h-[52px] rounded-[var(--radius-s)] border border-border-brand typography-body-bold text-text-brand"
        >
          상담 신청
        </button>
        <button
          type="button"
          className="flex h-[52px] items-center justify-center gap-0.5 rounded-[var(--radius-s)] bg-interaction-brand typography-body-bold text-text-inverse"
        >
          <img src={messageIcon} alt="" />
          예약하기
        </button>
      </div>
    </>
  );
}

export default HospitalDetailPage;
