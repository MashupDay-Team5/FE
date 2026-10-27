// 병원 상세 탭: 가격 / 리뷰 / Q&A
export type HospitalDetailTab = 'price' | 'review' | 'qna';

// 리뷰 세그먼트: 관련 리뷰 / 이 병원의 다른 리뷰
export type HospitalReviewSegment = 'related' | 'other';

// 리뷰 정렬: 기본순 / 최신순 / 높은평점순 / 낮은평점순 / 도움많은순
export type HospitalReviewSort =
  'default' | 'latest' | 'highest-rating' | 'lowest-rating' | 'most-helpful';

// 리뷰 결제 금액 항목
export type HospitalReviewPayment = {
  treatmentName: string;
  price: string;
  description?: string;
};

// 작성한 리뷰 수·받은 좋아요 수·프로필 사진은 API에서 내려주지 않아 값이 없으면 숨긴다.
export type HospitalReviewAuthor = {
  nickname: string;
  profileImageUrl?: string;
  reviewCount?: number;
  likeCount?: number;
};

// ReviewPanel에 전달할 리뷰 한 건의 구조
export type HospitalReview = {
  reviewId: number;
  isReceiptVerified: boolean;
  isVisitedViaModoodoc: boolean;
  treatmentNames: string[];
  rating: number;
  willRevisit: boolean;
  doctorName?: string;
  payments: HospitalReviewPayment[];
  body: string;
  author: HospitalReviewAuthor;
  // YYYY.MM.DD 형식 (한국 시간 기준)
  createdAt: string;
  helpfulCount: number;
  isReservationVisit: boolean;
  isPriceMatched: boolean;
};

// 상세페이지 진료 항목 영역 정보
export type HospitalDetailTreatment = {
  treatmentId: number;
  name: string;
};

// 병원 상세페이지 상단 데이터 구조
export type HospitalDetail = {
  hospitalId: number;
  hospitalName: string;
  hasDiscount: boolean;
  rating: string;
  reviewCount: string;
  address: string;
  treatment: HospitalDetailTreatment;
  relatedReviewCount: number;
  otherReviewCount: number;
};

// --- API 응답 ---

export type HospitalDetailRegionResponse = {
  sidoId: number | null;
  sidoName: string | null;
  sigunguId: number | null;
  sigunguName: string | null;
  dongId: number | null;
  dongName: string | null;
};

export type HospitalDetailTreatmentResponse = {
  treatmentId: number;
  treatmentName: string;
  regularPrice: number | null;
  discountPrice: number | null;
};

export type HospitalDetailResponse = {
  hospitalId: number;
  hospitalName: string;
  region: HospitalDetailRegionResponse | null;
  rating: number | null;
  totalReviewCount: number;
  relatedReviewCount: number;
  otherReviewCount: number;
  treatment: HospitalDetailTreatmentResponse;
};

export type ReviewScopeRequest = 'RELATED' | 'OTHER';

export type ReviewSortRequest =
  'DEFAULT' | 'LATEST' | 'HIGHEST_RATING' | 'LOWEST_RATING' | 'MOST_HELPFUL';

export type ReviewReceivedTreatmentResponse = {
  treatmentId: number;
  name: string;
  paidPrice: number | null;
};

export type ReviewItemResponse = {
  reviewId: number;
  authorDisplayName: string;
  rating: number;
  content: string;
  receivedTreatments: ReviewReceivedTreatmentResponse[];
  // 리뷰 전체 결제 금액. 시술별 금액(receivedTreatments[].paidPrice)은 현재 항상 null이다.
  paidPrice: number | null;
  doctorName: string | null;
  willRevisit: boolean;
  receiptVerified: boolean;
  modoodocVisit: boolean;
  reservationVisit: boolean;
  helpfulCount: number;
  // UTC 시각 (ISO 8601)
  createdAt: string;
};

export type ReviewListResponse = {
  hospitalId: number;
  treatmentId: number;
  scope: ReviewScopeRequest;
  items: ReviewItemResponse[];
  totalCount: number;
  page: number;
  size: number;
  hasNext: boolean;
};

export type ReviewKeywordResponse = {
  hospitalId: number;
  treatmentId: number;
  keywords: string[];
};
