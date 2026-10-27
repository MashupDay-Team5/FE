import { useTreatmentCategories } from '@/hooks/useTreatmentCategories';
import { useHospitalListState } from '@/hooks/useHospitalListState';
import { useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import arrowRightIcon from '@/assets/icons/arrowRight.svg';
import FilterChip from '@/components/common/FilterChip';
import MenuTrigger from '@/components/common/MenuTrigger';
import TreatmentCategorySheet from '@/components/common/TreatmentCategorySheet';
import TreatmentCategoriesStatus from '@/components/common/TreatmentCategoriesStatus';
import BottomNav from '@/components/layout/BottomNav';
import Header from '@/components/layout/Header';
import TopArea from '@/components/layout/TopArea';
import MallBanner from '@/components/mall/MallBanner';
import MallHospitalList from '@/components/mall/MallHospitalList';
import {
  defaultHospitalSortOptions,
  lowestPriceSortOption,
} from '@/constants/hospitalSearch';
import { DEFAULT_VISIBLE_HOSPITAL_COUNT } from '@/constants/hospitalList';
import { hospitalSearchItems } from '@/mocks/hospitals';
import type { HospitalSort } from '@/types/hospitalSearch';
import type { TreatmentScope } from '@/types/treatment';
import { getSortedHospitals } from '@/utils/hospitalSearch';
import {
  getHospitalSearchUrl,
  getSelectedProcedureIds,
  getTreatmentScope,
  getTreatmentSearchParams,
} from '@/utils/hospitalSearchUrl';

function UniversityMallPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { categories: medicalCategories } = useTreatmentCategories();
  const treatmentScope = getTreatmentScope(searchParams, medicalCategories);
  const { listState, setListState, listEntryKey } =
    useHospitalListState('home');
  const selectedSort = listState.sort;
  const visibleHospitalCount =
    listState.visibleHospitalCount ?? DEFAULT_VISIBLE_HOSPITAL_COUNT;
  const [isCategorySheetOpen, setCategorySheetOpen] = useState(false);
  const scopeTriggerRef = useRef<HTMLButtonElement>(null);

  const medicalCategory =
    medicalCategories.find(
      ({ id }) => id === treatmentScope?.medicalCategoryId,
    ) ?? medicalCategories[0];
  const treatmentCategory = medicalCategory?.treatmentCategories.find(
    ({ id }) => id === treatmentScope?.treatmentCategoryId,
  );
  // '전체'를 고르면 진료과의 모든 시술을 퀵필터로 보여준다.
  const treatments = treatmentCategory
    ? treatmentCategory.treatments
    : (medicalCategory?.treatmentCategories.flatMap(
        ({ treatments: categoryTreatments }) => categoryTreatments,
      ) ?? []);
  const selectedProcedureIds = getSelectedProcedureIds(
    searchParams,
    treatments,
  );

  const handleProcedureClick = (procedureId: number) => {
    if (!treatmentScope) {
      return;
    }

    const nextProcedureIds = selectedProcedureIds.includes(procedureId)
      ? selectedProcedureIds.filter((id) => id !== procedureId)
      : [...selectedProcedureIds, procedureId];
    setSearchParams(
      getTreatmentSearchParams(treatmentScope, nextProcedureIds),
      { replace: true },
    );
    setListState((current) => ({
      ...current,
      visibleHospitalCount: DEFAULT_VISIBLE_HOSPITAL_COUNT,
    }));
  };

  const handleScopeSelect = (scope: TreatmentScope) => {
    if (
      scope.medicalCategoryId === treatmentScope?.medicalCategoryId &&
      scope.treatmentCategoryId === treatmentScope?.treatmentCategoryId
    ) {
      return;
    }

    setSearchParams(getTreatmentSearchParams(scope), { replace: true });
    setListState((current) => ({
      ...current,
      visibleHospitalCount: DEFAULT_VISIBLE_HOSPITAL_COUNT,
    }));
  };

  const sortOptions =
    selectedProcedureIds.length > 0
      ? [...defaultHospitalSortOptions, lowestPriceSortOption]
      : defaultHospitalSortOptions;
  const selectedSortOption =
    sortOptions.find((option) => option.value === selectedSort) ??
    sortOptions[0];

  if (
    treatmentScope &&
    selectedProcedureIds.length === 0 &&
    selectedSort === 'lowest-price'
  ) {
    setListState({
      sort: 'most-visited',
      visibleHospitalCount: DEFAULT_VISIBLE_HOSPITAL_COUNT,
    });
  }

  const handleSortChange = (sort: HospitalSort) => {
    setListState({
      sort,
      visibleHospitalCount: DEFAULT_VISIBLE_HOSPITAL_COUNT,
    });
  };

  // API 연동 전 확인용 필터: 선택한 시술(없으면 현재 진료 범위의 시술)에 해당하는 가격 카드만 남기고,
  // 남은 카드가 없는 병원은 목록에서 뺀다. 연동 후에는 서버 응답으로 대체한다.
  const visibleProcedureIds = new Set(
    selectedProcedureIds.length === 0
      ? treatments.map(({ id }) => id)
      : selectedProcedureIds,
  );
  const filteredHospitals = hospitalSearchItems
    .map((hospital) => ({
      ...hospital,
      priceCards: hospital.priceCards.filter(({ procedureId }) =>
        visibleProcedureIds.has(procedureId),
      ),
    }))
    .filter(({ priceCards }) => priceCards.length > 0);
  const sortedHospitals = getSortedHospitals(filteredHospitals, selectedSort);
  const visibleHospitals = sortedHospitals.slice(0, visibleHospitalCount);

  return (
    <>
      <TopArea>
        <Header
          type="MainHome"
          schoolName="5팀대학교"
          onSearchClick={() =>
            navigate(
              treatmentScope
                ? getHospitalSearchUrl(treatmentScope, selectedProcedureIds)
                : {
                    pathname: '/mall/university/results',
                    search: searchParams.toString(),
                  },
              {
                state: {
                  homeSearch: searchParams.toString(),
                  homeListStateKey: listEntryKey,
                },
              },
            )
          }
        />
      </TopArea>

      <div className="pb-[calc(56px+env(safe-area-inset-bottom))]">
        <MallBanner specialSaleLabel="안과 특가전" />

        <button
          ref={scopeTriggerRef}
          type="button"
          aria-haspopup="dialog"
          aria-expanded={isCategorySheetOpen}
          disabled={!treatmentScope}
          onClick={() => setCategorySheetOpen(true)}
          className="mt-padding-m mb-gap-xs flex h-9 items-center disabled:opacity-50"
        >
          <span className="typography-heading-bold text-text-strong">
            {medicalCategory
              ? `${medicalCategory.name} · ${treatmentCategory?.name ?? '전체'}`
              : '진료 선택'}
          </span>
          <span className="flex size-6 shrink-0 items-center justify-center">
            <img src={arrowRightIcon} alt="" />
          </span>
        </button>

        {/* 진료 항목 퀵필터: 스크롤 시 Header 바로 아래에 고정한다. */}
        {treatments.length > 0 && (
          <div className="scrollbar-hidden sticky top-[calc(env(safe-area-inset-top)+52px)] z-[5] -mx-padding-m flex gap-gap-xs overflow-x-auto bg-surface-default py-padding-xs pl-padding-m">
            {treatments.map((treatment) => (
              <FilterChip
                key={treatment.id}
                label={treatment.name}
                selected={selectedProcedureIds.includes(treatment.id)}
                onClick={() => handleProcedureClick(treatment.id)}
              />
            ))}
            <div aria-hidden="true" className="h-8 w-4 shrink-0" />
          </div>
        )}

        <TreatmentCategoriesStatus />

        <MenuTrigger<HospitalSort>
          label={selectedSortOption.label}
          size="s"
          options={sortOptions}
          selectedValue={selectedSortOption.value}
          onValueChange={handleSortChange}
          disabled={!treatmentScope}
        />

        {treatmentScope && (
          <MallHospitalList
            hospitals={visibleHospitals}
            hasMore={visibleHospitalCount < filteredHospitals.length}
            onMoreClick={() =>
              setListState((current) => ({
                ...current,
                visibleHospitalCount:
                  (current.visibleHospitalCount ??
                    DEFAULT_VISIBLE_HOSPITAL_COUNT) +
                  DEFAULT_VISIBLE_HOSPITAL_COUNT,
              }))
            }
          />
        )}
      </div>

      {treatmentScope && (
        <TreatmentCategorySheet
          isOpen={isCategorySheetOpen}
          categories={medicalCategories}
          selectedScope={treatmentScope}
          onSelect={handleScopeSelect}
          onClose={() => setCategorySheetOpen(false)}
          triggerRef={scopeTriggerRef}
        />
      )}
      <BottomNav selected="home" />
    </>
  );
}

export default UniversityMallPage;
