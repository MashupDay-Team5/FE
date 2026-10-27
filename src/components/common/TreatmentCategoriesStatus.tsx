import { useTreatmentCategories } from '@/hooks/useTreatmentCategories';

function TreatmentCategoriesStatus() {
  const { status, categories, retry } = useTreatmentCategories();

  if (status === 'success' && categories.length > 0) {
    return null;
  }

  return (
    <div className="flex flex-col items-center gap-gap-s py-padding-m text-center typography-body-regular text-text-secondary">
      <p role={status === 'error' ? 'alert' : 'status'}>
        {status === 'loading'
          ? '진료 선택지를 불러오는 중이에요.'
          : status === 'error'
            ? '진료 선택지를 불러오지 못했어요.'
            : '등록된 진료 선택지가 없어요.'}
      </p>
      {status !== 'loading' && (
        <button
          type="button"
          className="min-h-11 px-padding-m text-text-brand"
          onClick={retry}
        >
          다시 시도
        </button>
      )}
    </div>
  );
}

export default TreatmentCategoriesStatus;
