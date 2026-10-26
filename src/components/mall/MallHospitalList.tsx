import ListCard from '@/components/hospital/ListCard';
import PriceCard from '@/components/hospital/PriceCard';
import type { HospitalSearchItem } from '@/types/hospitalSearch';
import { getHospitalDetailUrl } from '@/utils/hospitalSearchUrl';

type MallHospitalListProps = {
  hospitals: HospitalSearchItem[];
  hasMore: boolean;
  onMoreClick: () => void;
};

function MallHospitalList({
  hospitals,
  hasMore,
  onMoreClick,
}: MallHospitalListProps) {
  // 결과 없음 디자인이 확정되기 전까지 사용하는 임시 빈 상태
  if (hospitals.length === 0) {
    return (
      <section className="flex flex-col items-center py-[80px]">
        <p className="typography-body-medium text-text-tertiary">
          조건에 맞는 병원이 없어요
        </p>
      </section>
    );
  }

  return (
    <section className="-mx-padding-m flex flex-col">
      {hospitals.map((hospital) => {
        const priceCards = hospital.priceCards.map((priceCard) => (
          <PriceCard
            key={priceCard.procedureId}
            {...priceCard}
            width={hospital.priceCards.length === 1 ? 'fill' : 'fixed'}
          />
        ));

        return (
          <ListCard
            key={hospital.hospitalId}
            hospitalName={hospital.hospitalName}
            rating={hospital.rating}
            reviewCount={hospital.reviewCount}
            address={hospital.address}
            thumbnailUrl={hospital.thumbnailUrl}
            isPopular={hospital.isPopular}
            availabilityBadges={hospital.availabilityBadges}
            showDiscountIcon={hospital.hasDiscount}
            detailPath={getHospitalDetailUrl(hospital.hospitalId)}
            priceCards={priceCards}
          />
        );
      })}

      {hasMore && (
        <div className="px-padding-m py-padding-l">
          <button
            type="button"
            onClick={onMoreClick}
            className="flex h-11 w-full items-center justify-center rounded-[var(--radius-s)] border border-border-neutral bg-surface-default typography-body-medium text-text-primary"
          >
            더보기
          </button>
        </div>
      )}
    </section>
  );
}

export default MallHospitalList;
