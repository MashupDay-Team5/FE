import { useState } from 'react';
import FilterChip from '@/components/common/FilterChip';
import Tab, { type TabItem } from '@/components/common/Tab';
import Header from '@/components/layout/Header';
import TopArea from '@/components/layout/TopArea';
import { hospitalSearchProcedures } from '@/mocks/hospitalSearch';
import type { HospitalSearchTab } from '@/types/hospitalSearch';

const hospitalSearchTabItems: TabItem<HospitalSearchTab>[] = [
  { value: 'integrated', label: '통합' },
  { value: 'hospital', label: '병원' },
  { value: 'consultation', label: '의료상담' },
  { value: 'blog', label: '블로그' },
];

function HospitalSearchResultPage() {
  const [selectedProcedureIds, setSelectedProcedureIds] = useState<number[]>([
    2, 3,
  ]);
  const [selectedTab, setSelectedTab] = useState<HospitalSearchTab>('hospital');

  const handleProcedureClick = (procedureId: number) => {
    setSelectedProcedureIds((currentIds) =>
      currentIds.includes(procedureId)
        ? currentIds.filter((id) => id !== procedureId)
        : [...currentIds, procedureId],
    );
  };

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
      </TopArea>
      <div className="-mx-[var(--spacing-padding-m)] pt-padding-xs">
        <Tab
          items={hospitalSearchTabItems}
          selectedValue={selectedTab}
          onValueChange={setSelectedTab}
          layout="fill"
        />
      </div>
    </>
  );
}

export default HospitalSearchResultPage;
