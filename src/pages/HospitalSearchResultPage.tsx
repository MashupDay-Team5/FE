import Header from '@/components/layout/Header';
import TopArea from '@/components/layout/TopArea';

function HospitalSearchResultPage() {
  return (
    <>
      <TopArea>
        <Header type="DetailSearch" categoryName="시력교정술" />
      </TopArea>
      <h1>병원 검색 결과</h1>
    </>
  );
}

export default HospitalSearchResultPage;
