import BottomNav from '@/components/layout/BottomNav';
import Header from '@/components/layout/Header';
import TopArea from '@/components/layout/TopArea';

function UniversityMallPage() {
  return (
    <>
      <TopArea>
        <Header type="MainHome" schoolName="5팀대학교" />
      </TopArea>
      <h1>대학생 할인몰</h1>
      <BottomNav selected="home" />
    </>
  );
}

export default UniversityMallPage;
