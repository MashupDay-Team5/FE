import type { PropsWithChildren } from 'react';

function AppLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-dvh bg-[var(--color-surface-subtle)]">
      <main className="min-h-dvh w-full max-w-[480px] mx-auto bg-[var(--color-surface-default)] px-[var(--spacing-padding-m)]">
        {children}
      </main>
    </div>
  );
}

export default AppLayout;
