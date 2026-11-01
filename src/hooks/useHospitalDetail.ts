import { useEffect, useState } from 'react';
import { ApiError } from '@/api/error';
import {
  getHospitalDetail,
  getHospitalReviewKeywords,
} from '@/api/hospitalDetail';
import type { HospitalDetail } from '@/types/hospitalDetail';
import { toHospitalDetail } from '@/utils/hospitalDetail';

type HospitalDetailState =
  | { status: 'loading' }
  | { status: 'not-found' }
  | { status: 'error' }
  | { status: 'success'; hospital: HospitalDetail };

// 응답이 어느 요청의 결과인지 key로 구분한다. 현재 요청의 결과가 없으면 불러오는 중이다.
type Loaded<T> = { key: string; value: T };

export type HospitalDetailResult = HospitalDetailState & {
  // 키워드를 불러오지 못하면 빈 목록으로 두고 상세 화면은 그대로 보여준다.
  keywords: string[];
  retry: () => void;
};

function isNotFoundError(error: unknown) {
  return error instanceof ApiError && error.status === 404;
}

export function useHospitalDetail(
  hospitalId: number,
  treatmentId: number,
): HospitalDetailResult {
  const isValidId =
    Number.isInteger(hospitalId) && Number.isInteger(treatmentId);
  const [requestCount, setRequestCount] = useState(0);
  const requestKey = `${hospitalId}-${treatmentId}-${requestCount}`;
  const [loadedState, setLoadedState] =
    useState<Loaded<HospitalDetailState> | null>(null);
  const [loadedKeywords, setLoadedKeywords] = useState<Loaded<string[]> | null>(
    null,
  );

  useEffect(() => {
    if (!isValidId) return;

    const controller = new AbortController();
    const params = { hospitalId, treatmentId, signal: controller.signal };

    getHospitalDetail(params)
      .then((response) => {
        if (!controller.signal.aborted) {
          setLoadedState({
            key: requestKey,
            value: { status: 'success', hospital: toHospitalDetail(response) },
          });
        }
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setLoadedState({
            key: requestKey,
            value: { status: isNotFoundError(error) ? 'not-found' : 'error' },
          });
        }
      });

    getHospitalReviewKeywords(params)
      .then((response) => {
        if (!controller.signal.aborted) {
          setLoadedKeywords({ key: requestKey, value: response.keywords });
        }
      })
      .catch(() => {});

    return () => controller.abort();
  }, [hospitalId, treatmentId, isValidId, requestKey]);

  const state: HospitalDetailState = !isValidId
    ? { status: 'not-found' }
    : loadedState?.key === requestKey
      ? loadedState.value
      : { status: 'loading' };

  return {
    ...state,
    keywords: loadedKeywords?.key === requestKey ? loadedKeywords.value : [],
    retry: () => setRequestCount((count) => count + 1),
  };
}
