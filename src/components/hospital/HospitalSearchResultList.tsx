import ListCard from '@/components/hospital/ListCard';
import PriceCard from '@/components/hospital/PriceCard';
import type { HospitalSearchItem } from '@/types/hospitalSearch';
import { getHospitalDetailUrl } from '@/utils/hospitalSearchUrl';

type HospitalSearchResultListProps = {
  hospitals: HospitalSearchItem[];
};

function HospitalSearchResultList({
  hospitals,
}: HospitalSearchResultListProps) {
  if (hospitals.length === 0) {
    return (
      <section
        aria-label="병원 검색 결과"
        className="-mx-padding-m mt-padding-m flex h-[120px] items-center justify-center overflow-hidden"
      >
        <p
          role="status"
          className="text-center typography-body-regular whitespace-nowrap text-text-tertiary"
        >
          해당 조건에 맞는 병원이 없어요
        </p>
      </section>
    );
  }

  return (
    <section
      aria-label="병원 검색 결과"
      className="-mx-padding-m flex flex-col pb-8"
    >
      {hospitals.map((hospital) => (
        <ListCard
          key={hospital.hospitalId}
          hospitalId={hospital.hospitalId}
          hospitalName={hospital.hospitalName}
          rating={hospital.rating}
          reviewCount={hospital.reviewCount}
          address={hospital.address}
          thumbnailUrl={hospital.thumbnailUrl}
          isPopular={hospital.isPopular}
          availabilityBadges={hospital.availabilityBadges}
          showDiscountIcon={hospital.hasDiscount}
          detailPath={getHospitalDetailUrl(hospital.hospitalId)}
          priceCards={hospital.priceCards.map((priceCard) => (
            <PriceCard
              key={priceCard.procedureId}
              {...priceCard}
              width="flex"
            />
          ))}
        />
      ))}
    </section>
  );
}

export default HospitalSearchResultList;
