import Header from '@/components/layout/Header';
import TopArea from '@/components/layout/TopArea';

function HospitalDetailPage() {
  return (
    <>
      <TopArea>
        <Header type="Detail" title="병원명" />
      </TopArea>
      <h1>병원 상세</h1>
    </>
  );
}

export default HospitalDetailPage;
