import { useState } from 'react';
import FilterChip from '@/components/common/FilterChip';
import Header from '@/components/layout/Header';
import TopArea from '@/components/layout/TopArea';
import { hospitalSearchProcedures } from '@/mocks/hospitalSearch';

function HospitalSearchResultPage() {
  const [selectedProcedureIds, setSelectedProcedureIds] = useState<number[]>([
    2, 3,
  ]);

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
    </>
  );
}

export default HospitalSearchResultPage;
