import { useEffect } from 'react';
import closeIcon from '@/assets/icons/close.svg';

type HospitalSearchFilterSheetProps = {
  isOpen: boolean;
  onClose: () => void;
};

function HospitalSearchFilterSheet({
  isOpen,
  onClose,
}: HospitalSearchFilterSheetProps) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-y-0 left-1/2 z-20 flex w-full max-w-[480px] -translate-x-1/2 flex-col items-center justify-end bg-black/70 pt-[140px]"
      onMouseDown={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="hospital-search-filter-title"
        className="flex h-[calc(100dvh-140px)] max-h-[672px] w-full max-w-[480px] shrink-0 flex-col overflow-hidden rounded-t-[var(--radius-l)] bg-surface-default"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="flex h-[60px] shrink-0 items-center justify-between bg-surface-default py-padding-xs pr-padding-s pl-padding-m">
          <h2
            id="hospital-search-filter-title"
            className="typography-headline-bold text-text-primary"
          >
            통합 필터
          </h2>
          <button
            type="button"
            aria-label="통합 필터 닫기"
            onClick={onClose}
            className="flex size-11 shrink-0 items-center justify-center"
          >
            <img src={closeIcon} alt="" width={24} height={24} />
          </button>
        </header>
      </section>
    </div>
  );
}

export default HospitalSearchFilterSheet;
