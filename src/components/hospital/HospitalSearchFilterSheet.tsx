import { useEffect } from 'react';

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
      className="fixed inset-0 z-20 flex flex-col items-center justify-end pt-[140px]"
      onMouseDown={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-label="통합 필터"
        className="flex h-full max-h-[672px] w-full max-w-[480px] flex-col rounded-t-[var(--radius-l)] bg-surface-default"
        onMouseDown={(event) => event.stopPropagation()}
      />
    </div>
  );
}

export default HospitalSearchFilterSheet;
