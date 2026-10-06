import { useParams } from 'react-router-dom';
import Header from '@/components/layout/Header';
import TopArea from '@/components/layout/TopArea';
import { findHospitalDetail } from '@/mocks/hospitalDetail';

type SectionPlaceholderProps = {
  label: string;
  className?: string;
};

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

  return (
    <>
      <TopArea>
        <Header type="Detail" title={hospital.hospitalName} />
      </TopArea>

      {/* 하단 고정 CTA에 마지막 콘텐츠가 가려지지 않도록 CTA 높이만큼 여백을 둔다. */}
      <div className="-mx-padding-m pb-[calc(80px+env(safe-area-inset-bottom))]">
        <SectionPlaceholder label="병원 대표 이미지" className="h-[200px]" />

        <section className="border-b border-border-neutral px-padding-m py-padding-l">
          <SectionPlaceholder label="타이틀 영역" className="h-12" />
        </section>

        <section className="flex flex-col gap-gap-m px-padding-m py-padding-l">
          <SectionPlaceholder label="진료 항목" className="h-11" />
          <SectionPlaceholder label="리뷰 키워드" className="h-24" />
        </section>

        <SectionPlaceholder label="관련된 리뷰 보러가기" className="h-12" />

        <section>
          <SectionPlaceholder label="가격 / 리뷰 / Q&A 탭" className="h-12" />
          <div className="flex flex-col gap-gap-m px-padding-m py-padding-m">
            <SectionPlaceholder label="세그먼트" className="h-11" />
            <SectionPlaceholder label="리뷰 헤더 · 정렬" className="h-11" />
          </div>
          <div className="flex flex-col gap-gap-l">
            <SectionPlaceholder label="리뷰 카드" className="h-[480px]" />
            <SectionPlaceholder label="리뷰 카드" className="h-[480px]" />
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
