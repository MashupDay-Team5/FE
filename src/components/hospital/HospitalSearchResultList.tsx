import ListCard from '@/components/hospital/ListCard';
import PriceCard from '@/components/hospital/PriceCard';
import type { HospitalSearchItem } from '@/types/hospitalSearch';

type HospitalSearchResultListProps = {
  hospitals: HospitalSearchItem[];
};

function HospitalSearchResultList({
  hospitals,
}: HospitalSearchResultListProps) {
  return (
    <section
      aria-label="병원 검색 결과"
      className="-mx-padding-m flex flex-col"
    >
      {hospitals.map((hospital) => (
        <ListCard
          key={hospital.hospitalId}
          hospitalName={hospital.hospitalName}
          rating={hospital.rating}
          reviewCount={hospital.reviewCount}
          address={hospital.address}
          thumbnailUrl={hospital.thumbnailUrl}
          visitCount={hospital.visitCount}
          isReservable={hospital.isReservable}
          showDiscountIcon={hospital.hasDiscount}
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
