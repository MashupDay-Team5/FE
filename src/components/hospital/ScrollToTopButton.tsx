import { useEffect, useState } from 'react';
import arrowDownIcon from '@/assets/icons/arrowDown20.svg';

type ScrollToTopButtonProps = {
  // 'always': 항상 보임 / 'afterScroll': 첫 화면 높이만큼 내려가면 나타남
  visibility?: 'always' | 'afterScroll';
  className?: string;
};

// 앱의 스크롤 컨테이너는 window가 아니라 #root다.
function getScrollContainer() {
  return document.getElementById('root');
}

// 맨 위로 버튼: 누르면 페이지 맨 위로 부드럽게 스크롤한다. 위치는 쓰는 쪽에서 className으로 정한다.
function ScrollToTopButton({
  visibility = 'always',
  className = '',
}: ScrollToTopButtonProps) {
  const [isScrolledDown, setScrolledDown] = useState(false);

  useEffect(() => {
    const scrollContainer = getScrollContainer();
    if (visibility !== 'afterScroll' || !scrollContainer) return;

    const handleScroll = () =>
      setScrolledDown(scrollContainer.scrollTop > window.innerHeight);
    handleScroll();
    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, [visibility]);

  const isVisible = visibility === 'always' || isScrolledDown;

  return (
    // 나타날 때 60px 아래에서 위로 올라오고, 사라질 때 같은 길이만큼 내려가며 흐려진다.
    // 숨겨진 동안에는 자리만 차지하고 누를 수 없게 한다.
    <button
      type="button"
      aria-hidden={!isVisible}
      tabIndex={isVisible ? undefined : -1}
      onClick={() =>
        getScrollContainer()?.scrollTo({ top: 0, behavior: 'smooth' })
      }
      className={`flex h-10 items-center gap-gap-xs rounded-full border border-border-weak bg-interaction-neutral-inverse px-padding-s shadow-[0_0_4px_0_rgb(0_0_0/12%)] typography-label-large-medium text-text-primary transition-[translate,opacity] duration-300 ease-out ${
        isVisible
          ? 'pointer-events-auto translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-[60px] opacity-0'
      } ${className}`}
    >
      <img src={arrowDownIcon} alt="" className="size-5 rotate-180" />맨 위로
    </button>
  );
}

export default ScrollToTopButton;
