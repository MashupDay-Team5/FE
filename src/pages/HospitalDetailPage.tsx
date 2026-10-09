import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import MenuTrigger, {
  type MenuTriggerOption,
} from '@/components/common/MenuTrigger';
import SegmentControl, {
  type SegmentControlItem,
} from '@/components/common/SegmentControl';
import Tab, { type TabItem } from '@/components/common/Tab';
import HospitalDetailTitle from '@/components/hospital/HospitalDetailTitle';
import RelatedReviewBar from '@/components/hospital/RelatedReviewBar';
import ReviewPanel from '@/components/hospital/ReviewPanel';
import Header from '@/components/layout/Header';
import TopArea from '@/components/layout/TopArea';
import { findHospitalDetail } from '@/mocks/hospitalDetail';
import type {
  HospitalDetailTab,
  HospitalReviewSegment,
  HospitalReviewSort,
} from '@/types/hospitalDetail';

type SectionPlaceholderProps = {
  label: string;
  className?: string;
};

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

// 골격 단계에서 각 영역의 위치만 잡아두는 임시 박스. 영역을 구현하면서 하나씩 교체한다.
function SectionPlaceholder({
  label,
  className = '',
}: SectionPlaceholderProps) {
  return (
    <div
      className={`flex items-center justify-center border border-dashed border-border-neutral-strong bg-surface-weak typography-label-small-medium text-text-tertiary ${className}`}
    >
      {label}
    </div>
  );
}

function HospitalDetailPage() {
  const { hospitalId } = useParams();
  const hospital = findHospitalDetail(Number(hospitalId));
  const heroImageRef = useRef<HTMLDivElement>(null);
  const reviewSectionRef = useRef<HTMLElement>(null);
  const [isHeroVisible, setHeroVisible] = useState(true);
  const [selectedTab, setSelectedTab] = useState<HospitalDetailTab>('review');
  const [selectedSegment, setSelectedSegment] =
    useState<HospitalReviewSegment>('related');
  const [selectedSort, setSelectedSort] =
    useState<HospitalReviewSort>('default');

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
  }, [hospital]);

  if (!hospital) {
    return (
      <>
        <TopArea>
          <Header type="Detail" title="" />
        </TopArea>
        <p className="py-padding-l text-center typography-body-medium text-text-secondary">
          병원 정보를 찾을 수 없어요.
        </p>
      </>
    );
  }

  // 가격·Q&A 탭은 디자인 확정 전까지 비활성화한다.
  const tabItems: TabItem<HospitalDetailTab>[] = [
    { value: 'price', label: '가격', disabled: true },
    {
      value: 'review',
      label: `리뷰(${hospital.relatedReviewCount + hospital.otherReviewCount})`,
    },
    { value: 'qna', label: `Q&A(${hospital.qnaCount})`, disabled: true },
  ];
  const segmentItems: SegmentControlItem<HospitalReviewSegment>[] = [
    { value: 'related', label: `관련 리뷰 (${hospital.relatedReviewCount})` },
    {
      value: 'other',
      label: `이 병원의 다른 리뷰(${hospital.otherReviewCount})`,
    },
  ];

  const selectedSortOption =
    reviewSortOptions.find(({ value }) => value === selectedSort) ??
    reviewSortOptions[0];
  // 정렬은 ReviewPanel 목록 연결 단계에서 적용한다.
  const segmentReviews = hospital.reviews.filter(
    ({ segment }) => segment === selectedSegment,
  );
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

  return (
    <>
      <TopArea transparent={isHeroVisible}>
        <Header
          type="Detail"
          title={hospital.hospitalName}
          transparent={isHeroVisible}
        />
      </TopArea>

      {/* 하단 고정 CTA에 마지막 콘텐츠가 가려지지 않도록 CTA 높이만큼 여백을 둔다. */}
      <div className="-mx-padding-m pb-[calc(80px+env(safe-area-inset-bottom))]">
        {/* 대표 이미지는 Header 아래까지 끌어올려 Header가 이미지 위에 겹치게 한다. */}
        <div
          ref={heroImageRef}
          className="-mt-[calc(52px+env(safe-area-inset-top))] aspect-[375/216] w-full bg-surface-weak"
        >
          {hospital.imageUrl && (
            <img
              src={hospital.imageUrl}
              alt=""
              className="size-full object-cover"
            />
          )}
        </div>

        <HospitalDetailTitle
          hospitalName={hospital.hospitalName}
          hasDiscount={hospital.hasDiscount}
          rating={hospital.rating}
          reviewCount={hospital.reviewCount}
          address={hospital.address}
        />

        <section className="flex flex-col gap-gap-m px-padding-m py-padding-l">
          <SectionPlaceholder label="진료 항목" className="h-11" />
          <SectionPlaceholder label="리뷰 키워드" className="h-24" />
        </section>

        {hospital.relatedReviewCount >= MIN_RELATED_REVIEW_COUNT && (
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
          {/* 리뷰 카드 사이 16px은 Figma 시안 간격을 재서 맞춘 값이다. */}
          <div className="flex flex-col gap-gap-l">
            {segmentReviews.map((review) => (
              <ReviewPanel key={review.reviewId} review={review} />
            ))}
          </div>
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-0 mx-auto flex w-full max-w-[480px] gap-gap-s bg-surface-default px-padding-m pt-padding-s pb-[calc(var(--spacing-padding-m)+env(safe-area-inset-bottom))]">
        <button
          type="button"
          className="h-12 flex-1 rounded-[var(--radius-s)] border border-border-brand typography-body-bold text-text-brand"
        >
          상담 신청
        </button>
        <button
          type="button"
          className="h-12 flex-1 rounded-[var(--radius-s)] bg-interaction-brand typography-body-bold text-text-inverse"
        >
          예약하기
        </button>
      </div>
    </>
  );
}

export default HospitalDetailPage;
