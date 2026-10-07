import { defaultTreatmentScope } from '@/constants/treatment';
import { medicalCategories } from '@/mocks/treatment';
import { useRef, useState } from 'react';
import arrowDownIcon from '@/assets/icons/arrowDown20.svg';
import FilterChip from '@/components/common/FilterChip';
import MenuTrigger, {
  type MenuTriggerOption,
} from '@/components/common/MenuTrigger';
import TreatmentCategorySheet from '@/components/common/TreatmentCategorySheet';
import BottomNav from '@/components/layout/BottomNav';
import Header from '@/components/layout/Header';
import TopArea from '@/components/layout/TopArea';
import MallBanner from '@/components/mall/MallBanner';
import MallHospitalList from '@/components/mall/MallHospitalList';
import { universityMallHospitals } from '@/mocks/universityMall';
import type { TreatmentScope } from '@/types/treatment';

const HOSPITAL_PAGE_SIZE = 8;

type HospitalSort =
  'most-visited' | 'highest-rating' | 'most-reviews' | 'lowest-price';

const defaultHospitalSortOptions: MenuTriggerOption<HospitalSort>[] = [
  { value: 'most-visited', label: '방문 많은 순' },
  { value: 'highest-rating', label: '평점순' },
  { value: 'most-reviews', label: '리뷰 많은 순' },
];

const lowestPriceSortOption: MenuTriggerOption<HospitalSort> = {
  value: 'lowest-price',
  label: '낮은 가격 순',
};

function UniversityMallPage() {
  const [treatmentScope, setTreatmentScope] = useState<TreatmentScope>(
    defaultTreatmentScope,
  );
  const [selectedProcedureId, setSelectedProcedureId] = useState<number | null>(
    null,
  );
  const [selectedSort, setSelectedSort] =
    useState<HospitalSort>('most-visited');
  const [visibleHospitalCount, setVisibleHospitalCount] =
    useState(HOSPITAL_PAGE_SIZE);
  const [isCategorySheetOpen, setCategorySheetOpen] = useState(false);
  const scopeTriggerRef = useRef<HTMLButtonElement>(null);

  const medicalCategory =
    medicalCategories.find(
      ({ id }) => id === treatmentScope.medicalCategoryId,
    ) ?? medicalCategories[0];
  const treatmentCategory = medicalCategory.treatmentCategories.find(
    ({ id }) => id === treatmentScope.treatmentCategoryId,
  );
  // '전체'를 고르면 진료과의 모든 시술을 퀵필터로 보여준다.
  const treatments = treatmentCategory
    ? treatmentCategory.treatments
    : medicalCategory.treatmentCategories.flatMap(
        ({ treatments: categoryTreatments }) => categoryTreatments,
      );

  // 진료 항목은 하나만 선택하고, 다시 누르면 해제해 '전체 조회'로 돌아간다.
  const handleProcedureClick = (procedureId: number) => {
    setSelectedProcedureId((currentId) =>
      currentId === procedureId ? null : procedureId,
    );
    setVisibleHospitalCount(HOSPITAL_PAGE_SIZE);
  };

  const handleScopeSelect = (scope: TreatmentScope) => {
    setTreatmentScope(scope);
    setSelectedProcedureId(null);
    setVisibleHospitalCount(HOSPITAL_PAGE_SIZE);
  };

  const sortOptions =
    selectedProcedureId !== null
      ? [...defaultHospitalSortOptions, lowestPriceSortOption]
      : defaultHospitalSortOptions;
  const selectedSortOption =
    sortOptions.find((option) => option.value === selectedSort) ??
    sortOptions[0];

  // API 연동 전 확인용 필터: 선택한 시술(없으면 현재 진료 범위의 시술)에 해당하는 가격 카드만 남기고,
  // 남은 카드가 없는 병원은 목록에서 뺀다. 연동 후에는 서버 응답으로 대체한다.
  const visibleProcedureIds = new Set(
    selectedProcedureId === null
      ? treatments.map(({ id }) => id)
      : [selectedProcedureId],
  );
  const filteredHospitals = universityMallHospitals
    .map((hospital) => ({
      ...hospital,
      priceCards: hospital.priceCards.filter(({ procedureId }) =>
        visibleProcedureIds.has(procedureId),
      ),
    }))
    .filter(({ priceCards }) => priceCards.length > 0);
  const visibleHospitals = filteredHospitals.slice(0, visibleHospitalCount);

  return (
    <>
      <TopArea>
        <Header type="MainHome" schoolName="5팀대학교" />
      </TopArea>

      <div className="pb-[calc(56px+env(safe-area-inset-bottom))]">
        <MallBanner specialSaleLabel="안과 특가전" />

        <button
          ref={scopeTriggerRef}
          type="button"
          aria-haspopup="dialog"
          onClick={() => setCategorySheetOpen(true)}
          className="mt-padding-l flex h-11 items-center"
        >
          <span className="typography-headline-bold text-text-strong">
            {medicalCategory.name} · {treatmentCategory?.name ?? '전체'}
          </span>
          <img src={arrowDownIcon} alt="" className="size-5 -rotate-90" />
        </button>

        {/* 진료 항목 퀵필터: 스크롤 시 Header 바로 아래에 고정한다. */}
        <div className="scrollbar-hidden sticky top-[calc(env(safe-area-inset-top)+52px)] z-[5] -mx-padding-m flex gap-gap-xs overflow-x-auto bg-surface-default py-padding-xs pl-padding-m">
          {treatments.map((treatment) => (
            <FilterChip
              key={treatment.id}
              label={treatment.name}
              selected={treatment.id === selectedProcedureId}
              onClick={() => handleProcedureClick(treatment.id)}
            />
          ))}
          <div aria-hidden="true" className="h-8 w-4 shrink-0" />
        </div>

        <MenuTrigger<HospitalSort>
          label={selectedSortOption.label}
          size="s"
          options={sortOptions}
          selectedValue={selectedSortOption.value}
          onValueChange={setSelectedSort}
        />

        <MallHospitalList
          hospitals={visibleHospitals}
          selectedProcedureId={selectedProcedureId}
          hasMore={visibleHospitalCount < filteredHospitals.length}
          onMoreClick={() =>
            setVisibleHospitalCount((count) => count + HOSPITAL_PAGE_SIZE)
          }
        />
      </div>

      <TreatmentCategorySheet
        isOpen={isCategorySheetOpen}
        categories={medicalCategories}
        selectedScope={treatmentScope}
        onSelect={handleScopeSelect}
        onClose={() => setCategorySheetOpen(false)}
        triggerRef={scopeTriggerRef}
      />
      <BottomNav selected="home" />
    </>
  );
}

export default UniversityMallPage;
