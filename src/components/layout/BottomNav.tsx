import bottomHomeIcon from '@/assets/icons/bottomHome.svg';
import bottomMessageIcon from '@/assets/icons/bottomMessage.svg';
import bottomMypageIcon from '@/assets/icons/bottomMypage.svg';
import bottomReviewIcon from '@/assets/icons/bottomReview.svg';

export type BottomNavTab = 'home' | 'community' | 'review' | 'mypage';

type BottomNavProps = {
  selected: BottomNavTab;
  onTabClick?: (tab: BottomNavTab) => void;
};

const TABS: { tab: BottomNavTab; label: string; icon: string }[] = [
  { tab: 'home', label: '홈', icon: bottomHomeIcon },
  { tab: 'community', label: '의료상담/가격', icon: bottomMessageIcon },
  { tab: 'review', label: '리뷰작성', icon: bottomReviewIcon },
  { tab: 'mypage', label: '마이페이지', icon: bottomMypageIcon },
];

function BottomNav({ selected, onTabClick }: BottomNavProps) {
  return (
    // BottomSafeArea: 홈 인디케이터가 있는 모바일 기기에서만 하단 안전 영역만큼 흰 여백이 생긴다.
    <nav
      aria-label="하단 메뉴"
      className="fixed inset-x-0 bottom-0 mx-auto flex w-full max-w-[480px] justify-between border-t border-border-neutral bg-surface-default px-padding-m pb-[env(safe-area-inset-bottom)] shadow-[0_-2px_2px_0_rgb(0_0_0/8%)]"
    >
      {TABS.map(({ tab, label, icon }) => {
        const isSelected = tab === selected;

        return (
          <button
            key={tab}
            type="button"
            onClick={() => onTabClick?.(tab)}
            aria-current={isSelected ? 'page' : undefined}
            className={`flex h-14 w-16 flex-col items-center justify-center gap-gap-xs ${
              isSelected ? 'text-text-brand' : 'text-text-secondary'
            }`}
          >
            {/* SVG 모양만 mask로 쓰고 색은 텍스트 색(currentColor)을 따른다. */}
            <span
              aria-hidden
              className="size-6 bg-current mask-contain mask-center mask-no-repeat"
              style={{
                // 작은 SVG는 data URI로 인라인되므로 따옴표로 감싼다.
                maskImage: `url("${icon}")`,
                WebkitMaskImage: `url("${icon}")`,
              }}
            />
            <span className="typography-micro-medium whitespace-nowrap">
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

export default BottomNav;
