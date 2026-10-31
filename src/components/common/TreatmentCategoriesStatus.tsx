import { useEffect, useState } from 'react';
import { useTreatmentCategories } from '@/hooks/useTreatmentCategories';

function TreatmentCategoriesLoading() {
  const [showPlaceholder, setShowPlaceholder] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setShowPlaceholder(true), 200);
    return () => window.clearTimeout(timeoutId);
  }, []);

  return (
    <div role="status" aria-atomic="true">
      {showPlaceholder && (
        <span className="sr-only">진료 선택지를 불러오는 중이에요.</span>
      )}
      {showPlaceholder && (
        <div
          aria-hidden="true"
          className="flex gap-gap-xs overflow-hidden py-padding-xs"
        >
          {[0, 1, 2].map((index) => (
            <span
              key={index}
              className="h-8 w-24 shrink-0 rounded-full bg-surface-weak"
            />
          ))}
        </div>
      )}
    </div>
  );
}

function TreatmentCategoriesStatus() {
  const { status, categories, retry } = useTreatmentCategories();

  if (status === 'success' && categories.length > 0) {
    return null;
  }

  if (status === 'loading') return <TreatmentCategoriesLoading />;

  return (
    <div className="flex flex-col items-center gap-gap-s py-padding-m text-center typography-body-regular text-text-secondary">
      <p role={status === 'error' ? 'alert' : 'status'}>
        {status === 'error'
          ? '진료 선택지를 불러오지 못했어요.'
          : '등록된 진료 선택지가 없어요.'}
      </p>
      <button
        type="button"
        className="min-h-11 px-padding-m text-text-brand"
        onClick={retry}
      >
        다시 시도
      </button>
    </div>
  );
}

export default TreatmentCategoriesStatus;
