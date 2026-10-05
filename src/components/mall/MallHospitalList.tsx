import ListCard from '@/components/hospital/ListCard';
import PriceCard from '@/components/hospital/PriceCard';
import type {
  HospitalSearchItem,
  HospitalSearchPriceCard,
} from '@/types/hospitalSearch';

type MallHospitalListProps = {
  hospitals: HospitalSearchItem[];
  selectedProcedureId: number | null;
  hasMore: boolean;
  onMoreClick: () => void;
};

function renderPriceCard(
  priceCard: HospitalSearchPriceCard,
  width: 'fill' | 'fixed',
) {
  if (priceCard.type === 'free') {
    return (
      <PriceCard
        key={priceCard.procedureId}
        type="free"
        width={width}
        procedureName={priceCard.procedureName}
        originalPrice={priceCard.originalPrice}
        originalPriceLabel={priceCard.originalPriceLabel}
      />
    );
  }

  if (priceCard.type === 'badge') {
    return (
      <PriceCard
        key={priceCard.procedureId}
        type="badge"
        width={width}
        procedureName={priceCard.procedureName}
        originalPrice={priceCard.originalPrice}
        discountedPrice={priceCard.discountedPrice}
        badgeLabel={priceCard.badgeLabel}
      />
    );
  }

  return (
    <PriceCard
      key={priceCard.procedureId}
      type="default"
      width={width}
      procedureName={priceCard.procedureName}
      originalPrice={priceCard.originalPrice}
      discountedPrice={priceCard.discountedPrice}
    />
  );
}

// 시술을 선택하지 않으면 병원별 가격 카드를 가로 스크롤로, 선택하면 해당 시술 카드 1개를 전체 너비로 보여준다.
function MallHospitalList({
  hospitals,
  selectedProcedureId,
  hasMore,
  onMoreClick,
}: MallHospitalListProps) {
  return (
    <section className="-mx-padding-m flex flex-col">
      {hospitals.map((hospital) => {
        const priceCards =
          selectedProcedureId === null
            ? hospital.priceCards.map((priceCard) =>
                renderPriceCard(priceCard, 'fixed'),
              )
            : hospital.priceCards
                .filter(
                  ({ procedureId }) => procedureId === selectedProcedureId,
                )
                .map((priceCard) => renderPriceCard(priceCard, 'fill'));

        return (
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
