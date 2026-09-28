import { useState } from 'react';
import './App.css';
import Badge from '@/components/common/Badge';
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
      <div className="flex flex-wrap items-center gap-gap-s p-padding-m">
        <Badge size="L" color="keyword">
          라벨
        </Badge>
        <Badge size="M" color="tertiary" leadingIcon>
          라벨
        </Badge>
        <Badge size="M" color="secondary" leadingIcon>
          라벨
        </Badge>
        <Badge size="S" color="tertiary" leadingIcon>
          라벨
        </Badge>
        <Badge size="S" color="secondary" leadingIcon>
          라벨
        </Badge>
        <Badge size="S" color="secondary" shape="square" leadingIcon>
          라벨
        </Badge>
        <Badge size="S" color="sub" shape="square" leadingIcon>
          라벨
        </Badge>
      </div>
      <BottomNav selected={selectedTab} onTabClick={setSelectedTab} />
    </>
  );
}

export default App;
