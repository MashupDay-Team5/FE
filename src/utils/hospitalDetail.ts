import type {
  HospitalDetail,
  HospitalDetailRegionResponse,
  HospitalDetailResponse,
  HospitalReview,
  HospitalReviewSegment,
  HospitalReviewSort,
  ReviewItemResponse,
  ReviewScopeRequest,
  ReviewSortRequest,
} from '@/types/hospitalDetail';

export const reviewScopeRequests: Record<
  HospitalReviewSegment,
  ReviewScopeRequest
> = {
  related: 'RELATED',
  other: 'OTHER',
};

export const reviewSortRequests: Record<HospitalReviewSort, ReviewSortRequest> =
  {
    default: 'DEFAULT',
    latest: 'LATEST',
    'highest-rating': 'HIGHEST_RATING',
    'lowest-rating': 'LOWEST_RATING',
    'most-helpful': 'MOST_HELPFUL',
  };

const createdAtFormatter = new Intl.DateTimeFormat('ko-KR', {
  timeZone: 'Asia/Seoul',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

// UTC 작성 시각을 한국 시간 기준 YYYY.MM.DD로 바꾼다.
function formatCreatedAt(createdAt: string) {
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return '';

  const parts = Object.fromEntries(
    createdAtFormatter
      .formatToParts(date)
      .map(({ type, value }) => [type, value]),
  );
  return `${parts.year}.${parts.month}.${parts.day}`;
}

function formatPrice(price: number) {
  return `${price.toLocaleString('ko-KR')}원`;
}

// 시·구·동 이름을 이어 붙인다. 예: 서울 서초구 서초4동
function formatAddress(region: HospitalDetailRegionResponse | null) {
  if (!region) return '';

  return [region.sidoName, region.sigunguName, region.dongName]
    .filter(Boolean)
    .join(' ');
}

export function toHospitalDetail(
  response: HospitalDetailResponse,
): HospitalDetail {
  const { regularPrice, discountPrice } = response.treatment;

  return {
    hospitalId: response.hospitalId,
    hospitalName: response.hospitalName,
    hasDiscount:
      discountPrice !== null &&
      regularPrice !== null &&
      discountPrice < regularPrice,
    rating: (response.rating ?? 0).toFixed(1),
    reviewCount: String(response.totalReviewCount),
    address: formatAddress(response.region),
    treatment: {
      treatmentId: response.treatment.treatmentId,
      name: response.treatment.treatmentName,
    },
    relatedReviewCount: response.relatedReviewCount,
    otherReviewCount: response.otherReviewCount,
  };
}

export function toHospitalReview(item: ReviewItemResponse): HospitalReview {
  const treatmentNames = item.receivedTreatments.map(({ name }) => name);

  return {
    reviewId: item.reviewId,
    isReceiptVerified: item.receiptVerified,
    isVisitedViaModoodoc: item.modoodocVisit,
    treatmentNames,
    rating: item.rating,
    willRevisit: item.willRevisit,
    doctorName: item.doctorName ?? undefined,
    // API는 시술별 금액 없이 리뷰 전체 결제 금액만 주므로 한 줄로 보여준다.
    payments:
      item.paidPrice === null
        ? []
        : [
            {
              treatmentName: treatmentNames.join(', '),
              price: formatPrice(item.paidPrice),
            },
          ],
    body: item.content,
    author: { nickname: item.authorDisplayName },
    createdAt: formatCreatedAt(item.createdAt),
    helpfulCount: item.helpfulCount,
    isReservationVisit: item.reservationVisit,
    // 가격 일치 여부는 API에 없어 안내 문구를 보여주지 않는다.
    isPriceMatched: false,
  };
}
