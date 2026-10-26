import type { PropsWithChildren } from 'react';

type TopAreaProps = PropsWithChildren<{
  // 이미지 위에 겹쳐 놓을 때 Safe Area 배경도 함께 투명하게 한다.
  transparent?: boolean;
}>;

// TopArea: 상단 Safe Area와 페이지별 Header를 함께 고정한다.
function TopArea({ children, transparent = false }: TopAreaProps) {
  return (
    <div className="-mx-[var(--spacing-padding-m)] sticky top-0 z-10">
      <div
        className={`h-[env(safe-area-inset-top)] transition-colors ${
          transparent ? 'bg-transparent' : 'bg-[var(--color-surface-default)]'
        }`}
      />
      {children}
    </div>
  );
}

export default TopArea;
