import type { HospitalListLoadStatus } from '@/hooks/useHospitalList';

type HospitalListFeedbackProps = {
  status: HospitalListLoadStatus;
  hasHospitals: boolean;
  hasNext: boolean;
  onRetry: () => void;
  onMoreClick: () => void;
};

function HospitalListFeedback({
  status,
  hasHospitals,
  hasNext,
  onRetry,
  onMoreClick,
}: HospitalListFeedbackProps) {
  if (status === 'loading' && !hasHospitals) {
    return (
      <p
        role="status"
        className="py-padding-l text-center typography-body-regular text-text-secondary"
      >
        병원 목록을 불러오는 중이에요.
      </p>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex flex-col items-center gap-gap-s py-padding-l text-center typography-body-regular text-text-secondary">
        <p role="alert">병원 목록을 불러오지 못했어요.</p>
        <button
          type="button"
          onClick={onRetry}
          className="min-h-11 px-padding-m text-text-brand"
        >
          다시 시도
        </button>
      </div>
    );
  }

  if (!hasNext) return null;

  return (
    <div className="pt-padding-xs pb-padding-l">
      <button
        type="button"
        onClick={onMoreClick}
        disabled={status === 'loading'}
        className="flex h-11 w-full items-center justify-center rounded-[var(--radius-s)] border border-border-neutral bg-surface-default typography-body-medium text-text-primary disabled:text-text-disabled"
      >
        {status === 'loading' ? '불러오는 중…' : '더보기'}
      </button>
    </div>
  );
}

export default HospitalListFeedback;
