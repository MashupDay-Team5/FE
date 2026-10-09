// 병원 상세 탭: 가격 / 리뷰 / Q&A
export type HospitalDetailTab = 'price' | 'review' | 'qna';

// 리뷰 세그먼트: 관련 리뷰 / 이 병원의 다른 리뷰
export type HospitalReviewSegment = 'related' | 'other';

// 리뷰 정렬: 기본순 / 최신순 / 높은평점순 / 낮은평점순 / 도움많은순
export type HospitalReviewSort =
  'default' | 'latest' | 'highest-rating' | 'lowest-rating' | 'most-helpful';

// 리뷰 작성자 유형 (UserTypeBanner 문구 구분)
export type HospitalReviewUserType = 'general' | 'discount-mall';

// 리뷰 결제 금액 항목
export type HospitalReviewPayment = {
  treatmentName: string;
  price: string;
  description?: string;
};

export type HospitalReviewAuthor = {
  nickname: string;
  profileImageUrl?: string;
  reviewCount: number;
  likeCount: number;
};

// ReviewPanel에 전달할 리뷰 한 건의 구조
export type HospitalReview = {
  reviewId: number;
  segment: HospitalReviewSegment;
  userType: HospitalReviewUserType;
  // 기본순 정렬에서 같은 치료 항목 리뷰를 우선 노출하기 위한 값
  isSameTreatment: boolean;
  isReceiptVerified: boolean;
  isVisitedViaModoodoc: boolean;
  treatmentNames: string[];
  rating: number;
  willRevisit: boolean;
  doctorName?: string;
  payments: HospitalReviewPayment[];
  body: string;
  author: HospitalReviewAuthor;
  // YYYY.MM.DD 형식
  createdAt: string;
  helpfulCount: number;
  isReservationVisit: boolean;
  isPriceMatched: boolean;
};

// 상세페이지 진료 항목 영역 정보
export type HospitalDetailTreatment = {
  name: string;
  promotionCaption: string;
};

// 병원 상세페이지 전체 데이터 구조
export type HospitalDetail = {
  hospitalId: number;
  hospitalName: string;
  hasDiscount: boolean;
  rating: string;
  reviewCount: string;
  address: string;
  imageUrl?: string;
  treatment: HospitalDetailTreatment;
  // 관련 리뷰에서 추출한 키워드 (0~6개)
  keywords: string[];
  relatedReviewCount: number;
  otherReviewCount: number;
  qnaCount: number;
  reviews: HospitalReview[];
};
