import { useEffect, useState } from 'react';
import { getHospitalReviews } from '@/api/hospitalDetail';
import type {
  HospitalReview,
  HospitalReviewSegment,
  HospitalReviewSort,
} from '@/types/hospitalDetail';
import {
  reviewScopeRequests,
  reviewSortRequests,
  toHospitalReview,
} from '@/utils/hospitalDetail';

const REVIEW_PAGE_SIZE = 10;

type LoadStatus = 'loading' | 'error' | 'success';

type ReviewRequest = {
  // 병원·시술·세그먼트·정렬이 바뀌면 목록을 처음부터 다시 불러온다.
  key: string;
  page: number;
  attempt: number;
};

type ReviewListState = {
  // 마지막으로 응답을 받은 요청. 현재 요청과 다르면 불러오는 중이다.
  requestId: string;
  reviews: HospitalReview[];
  hasNext: boolean;
  status: 'error' | 'success';
};

function getRequestId({ key, page, attempt }: ReviewRequest) {
  return `${key}-${page}-${attempt}`;
}

type UseHospitalReviewsOptions = {
  hospitalId: number;
  treatmentId: number;
  segment: HospitalReviewSegment;
  sort: HospitalReviewSort;
  // 상세 정보를 불러온 뒤에만 요청한다.
  enabled: boolean;
};

export type HospitalReviewsResult = {
  reviews: HospitalReview[];
  hasNext: boolean;
  status: LoadStatus;
  // 더보기로 다음 페이지를 불러오는 상태. 첫 페이지 상태는 status로 구분한다.
  loadMoreStatus: 'idle' | 'loading' | 'error';
  // 다음 페이지를 불러온다. 직전 더보기가 실패했으면 같은 페이지를 다시 요청한다.
  loadMore: () => void;
  retry: () => void;
};

export function useHospitalReviews({
  hospitalId,
  treatmentId,
  segment,
  sort,
  enabled,
}: UseHospitalReviewsOptions): HospitalReviewsResult {
  const key = `${hospitalId}-${treatmentId}-${segment}-${sort}`;
  const [request, setRequest] = useState<ReviewRequest>({
    key,
    page: 0,
    attempt: 0,
  });
  const [list, setList] = useState<ReviewListState>({
    requestId: '',
    reviews: [],
    hasNext: false,
    status: 'success',
  });

  if (request.key !== key) {
    setRequest({ key, page: 0, attempt: 0 });
  }

  useEffect(() => {
    if (!enabled) return;

    const controller = new AbortController();
    const { page } = request;
    const requestId = getRequestId(request);

    getHospitalReviews({
      hospitalId,
      treatmentId,
      scope: reviewScopeRequests[segment],
      sort: reviewSortRequests[sort],
      page,
      size: REVIEW_PAGE_SIZE,
      signal: controller.signal,
    })
      .then((response) => {
        if (controller.signal.aborted) return;

        const reviews = response.items.map(toHospitalReview);
        setList((current) => ({
          requestId,
          reviews: page === 0 ? reviews : [...current.reviews, ...reviews],
          hasNext: response.hasNext,
          status: 'success',
        }));
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setList((current) => ({ ...current, requestId, status: 'error' }));
        }
      });

    return () => controller.abort();
    // request가 바뀔 때만 요청한다. 나머지 값은 request.key에 포함돼 있다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [request, enabled]);

  const isFirstPage = request.page === 0;
  const status: LoadStatus =
    list.requestId === getRequestId(request) ? list.status : 'loading';
  const retry = () =>
    setRequest((current) => ({ ...current, attempt: current.attempt + 1 }));

  return {
    reviews: list.reviews,
    hasNext: list.hasNext,
    status: isFirstPage ? status : 'success',
    loadMoreStatus: isFirstPage || status === 'success' ? 'idle' : status,
    loadMore: () => {
      if (!isFirstPage && status === 'error') {
        retry();
        return;
      }
      setRequest((current) => ({ ...current, page: current.page + 1 }));
    },
    retry,
  };
}
