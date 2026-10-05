import { useRef, useState } from 'react';
import FilterChip from '@/components/common/FilterChip';
import MenuTrigger, {
  type MenuTriggerOption,
} from '@/components/common/MenuTrigger';
import Tab, { type TabItem } from '@/components/common/Tab';
import HospitalSearchFilterSheet from '@/components/hospital/HospitalSearchFilterSheet';
import Header from '@/components/layout/Header';
import TopArea from '@/components/layout/TopArea';
import { hospitalSearchProcedures } from '@/mocks/hospitalSearch';
import type { HospitalSearchTab } from '@/types/hospitalSearch';

const hospitalSearchTabItems: TabItem<HospitalSearchTab>[] = [
  { value: 'integrated', label: '통합', disabled: true },
  { value: 'hospital', label: '병원' },
  { value: 'consultation', label: '의료상담', disabled: true },
  { value: 'blog', label: '블로그', disabled: true },
];

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

function HospitalSearchResultPage() {
  const [selectedProcedureIds, setSelectedProcedureIds] = useState<number[]>(
    [],
  );
  const [selectedTab, setSelectedTab] = useState<HospitalSearchTab>('hospital');
  const [selectedSort, setSelectedSort] =
    useState<HospitalSort>('most-visited');
  const [isFilterSheetOpen, setFilterSheetOpen] = useState(false);
  const filterTriggerRef = useRef<HTMLButtonElement>(null);

  const handleProcedureClick = (procedureId: number) => {
    setSelectedProcedureIds((currentIds) =>
      currentIds.includes(procedureId)
        ? currentIds.filter((id) => id !== procedureId)
        : [...currentIds, procedureId],
    );
  };

  const sortOptions =
    selectedProcedureIds.length > 0
      ? [...defaultHospitalSortOptions, lowestPriceSortOption]
      : defaultHospitalSortOptions;
  const selectedSortOption =
    sortOptions.find((option) => option.value === selectedSort) ??
    sortOptions[0];

  return (
    <>
      <TopArea>
        <Header type="DetailSearch" categoryName="시력교정술" />
        <div className="flex gap-gap-xs overflow-x-auto pl-padding-m py-padding-xs [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {hospitalSearchProcedures.map((procedure) => (
            <FilterChip
              key={procedure.id}
              label={procedure.name}
              selected={selectedProcedureIds.includes(procedure.id)}
              onClick={() => handleProcedureClick(procedure.id)}
            />
          ))}
          <div aria-hidden="true" className="h-8 w-4 shrink-0" />
        </div>
        <div className="bg-surface-default pt-padding-xs">
          <Tab
            items={hospitalSearchTabItems}
            selectedValue={selectedTab}
            onValueChange={setSelectedTab}
            layout="fill"
          />
        </div>
        <div className="flex items-center justify-between bg-surface-default px-padding-m py-padding-s">
          <FilterChip
            ref={filterTriggerRef}
            label="필터"
            selected={false}
            showIcon
            onClick={() => setFilterSheetOpen(true)}
          />
          <MenuTrigger<HospitalSort>
            label={selectedSortOption.label}
            size="s"
            options={sortOptions}
            selectedValue={selectedSortOption.value}
            align="end"
            onValueChange={setSelectedSort}
          />
        </div>
      </TopArea>
      <HospitalSearchFilterSheet
        isOpen={isFilterSheetOpen}
        onClose={() => setFilterSheetOpen(false)}
        triggerRef={filterTriggerRef}
      />
    </>
  );
}

export default HospitalSearchResultPage;
