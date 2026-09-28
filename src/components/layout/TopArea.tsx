import type { PropsWithChildren } from 'react';

// TopArea: 상단 Safe Area와 페이지별 Header를 함께 고정한다.
function TopArea({ children }: PropsWithChildren) {
  return (
    <div className="-mx-[var(--spacing-padding-m)] sticky top-0 z-10">
      <div
        className="h-[env(safe-area-inset-top)] bg-[var(--color-surface-default)]"
      />
      {children}
    </div>
  );
}

export default TopArea;
