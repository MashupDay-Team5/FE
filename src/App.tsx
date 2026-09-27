import './App.css';
import Header from '@/components/layout/Header';

function App() {
  return (
    <>
      <Header type="MainHome" schoolName="5팀대학교" />
      <Header type="DetailSearch" categoryName="시력교정술" />
      <Header type="Detail" title="텍스트" />
      <h1>Mashup Day Team5 - Modoodoc</h1>
    </>
  );
}

export default App;
