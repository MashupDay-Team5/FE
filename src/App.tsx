import { useState } from 'react';
import './App.css';
import BottomNav, { type BottomNavTab } from '@/components/layout/BottomNav';
import Header from '@/components/layout/Header';

function App() {
  const [selectedTab, setSelectedTab] = useState<BottomNavTab>('home');

  return (
    <>
      <Header type="MainHome" schoolName="5팀대학교" />
      <Header type="DetailSearch" categoryName="시력교정술" />
      <Header type="Detail" title="텍스트" />
      <h1>Mashup Day Team5 - Modoodoc</h1>
      <BottomNav selected={selectedTab} onTabClick={setSelectedTab} />
    </>
  );
}

export default App;
