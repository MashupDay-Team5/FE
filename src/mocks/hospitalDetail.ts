import type { HospitalDetail, HospitalReview } from '@/types/hospitalDetail';

const SAMPLE_REVIEW_BODY =
  '시력교정술 상담을 위해 방문했는데 검사 과정부터 전체적으로 꼼꼼하게 진행해주셔서 좋았습니다. 다양했고 각 검사 결과와 현재 눈 상태에 대해서도 이해하기 쉽게 설명해주셔서 수술 결정에 큰 도움이 되었습니다. 수술 당일에도 대기 시간이 길지 않았고, 수술 후에는 보호안경 착용법과 안약 넣는 순서까지 자세히 알려주셨어요. 일주일 뒤 검진에서도 회복이 잘 되고 있다고 해서 안심했습니다.';

// 리뷰 목업 공통값. 리뷰마다 정렬·세그먼트 확인에 필요한 값만 덮어쓴다.
const baseReview: Omit<
  HospitalReview,
  'reviewId' | 'segment' | 'createdAt' | 'rating' | 'helpfulCount'
> = {
  isSameTreatment: true,
  isReceiptVerified: true,
  isVisitedViaModoodoc: true,
  treatmentNames: ['시력교정술 검진', '스마일라식'],
  willRevisit: true,
  doctorName: '김재형',
  payments: [
    { treatmentName: '시력교정술 검진', price: '-원' },
    {
      treatmentName: '스마일라식',
      price: '1,900,000원',
      description: 'VISUMAX 500, 자이스\n자가혈청안약',
    },
  ],
  body: SAMPLE_REVIEW_BODY,
  author: { nickname: '몰도바 참돔45', reviewCount: 1, likeCount: 1 },
  isReservationVisit: true,
  isPriceMatched: true,
};

const richHospitalReviews: HospitalReview[] = [
  {
    ...baseReview,
    reviewId: 101,
    segment: 'related',
    createdAt: '2026.09.18',
    rating: 10,
    helpfulCount: 0,
  },
  {
    ...baseReview,
    reviewId: 102,
    segment: 'related',
    createdAt: '2026.09.25',
    rating: 8.5,
    helpfulCount: 12,
    willRevisit: false,
    body: '상담은 친절했지만 대기 시간이 조금 길었어요.',
    author: { nickname: '서초 라식러', reviewCount: 3, likeCount: 5 },
    isReservationVisit: false,
    isPriceMatched: false,
  },
  {
    ...baseReview,
    reviewId: 103,
    body: '라섹으로 상담을 받았는데 각막 두께 때문에 스마일라식보다 라섹이 낫다고 솔직하게 말씀해주셨어요. 회복 기간이 길다는 점도 미리 알려주셔서 마음의 준비를 할 수 있었습니다. 수술 후 3일 정도는 눈이 많이 시렸지만 처방해주신 안약 덕분에 금방 괜찮아졌어요.',
    segment: 'related',
    isSameTreatment: false,
    treatmentNames: ['라섹'],
    payments: [{ treatmentName: '라섹', price: '1,200,000원' }],
    createdAt: '2026.10.01',
    rating: 9,
    helpfulCount: 4,
    author: { nickname: '눈 건강 지킴이', reviewCount: 2, likeCount: 0 },
  },
  {
    ...baseReview,
    reviewId: 104,
    body: '할인몰에서 보고 처음 방문했어요. 가격은 안내받은 그대로였고 추가 비용도 없었습니다. 다만 주말이라 대기 인원이 많아서 검사까지 한 시간 가까이 기다렸어요. 평일 오전에 방문하시는 걸 추천드려요.',
    segment: 'related',
    createdAt: '2026.08.30',
    rating: 6,
    helpfulCount: 27,
    doctorName: undefined,
    author: { nickname: '할인몰 첫 방문', reviewCount: 1, likeCount: 2 },
  },
  {
    ...baseReview,
    reviewId: 105,
    body: '검사 장비가 최신이라 그런지 검사가 빠르게 끝났어요. 설명도 친절하셨습니다.',
    segment: 'related',
    isReceiptVerified: false,
    createdAt: '2026.09.05',
    rating: 9.5,
    helpfulCount: 8,
    author: { nickname: '안경 탈출', reviewCount: 4, likeCount: 7 },
  },
  {
    ...baseReview,
    reviewId: 201,
    body: '렌즈삽입술 상담을 받았는데 렌즈 종류별 장단점을 표로 정리해서 보여주셔서 비교하기 편했어요. 수술 후 빛 번짐이 조금 있었지만 한 달 정도 지나니 거의 느껴지지 않아요. 정기 검진 일정도 문자로 미리 알려주셔서 잊지 않고 다녀올 수 있었습니다.',
    segment: 'other',
    isSameTreatment: false,
    treatmentNames: ['렌즈삽입술'],
    payments: [{ treatmentName: '렌즈삽입술', price: '3,200,000원' }],
    createdAt: '2026.09.21',
    rating: 9,
    helpfulCount: 3,
    author: { nickname: '렌즈 졸업', reviewCount: 1, likeCount: 0 },
  },
  {
    ...baseReview,
    reviewId: 202,
    body: '아이 드림렌즈 검사로 방문했어요. 아이가 겁이 많은 편인데 선생님께서 하나하나 설명해주시면서 천천히 진행해주셨어요. 렌즈 관리 방법도 보호자에게 따로 자세히 알려주셔서 좋았습니다. 다음 정기 검진도 여기서 받으려고 해요.',
    segment: 'other',
    isSameTreatment: false,
    treatmentNames: ['드림렌즈 검사'],
    payments: [{ treatmentName: '드림렌즈 검사', price: '50,000원' }],
    createdAt: '2026.07.14',
    rating: 7.5,
    helpfulCount: 1,
    isReservationVisit: false,
    isPriceMatched: false,
    author: { nickname: '아이 엄마', reviewCount: 6, likeCount: 3 },
  },
];

const fewReviewHospitalReviews: HospitalReview[] = [
  {
    ...baseReview,
    reviewId: 301,
    segment: 'related',
    createdAt: '2026.09.28',
    rating: 9,
    helpfulCount: 2,
  },
  {
    ...baseReview,
    reviewId: 302,
    segment: 'other',
    isSameTreatment: false,
    treatmentNames: ['렌즈삽입술'],
    payments: [{ treatmentName: '렌즈삽입술', price: '2,100,000원' }],
    createdAt: '2026.09.10',
    rating: 8,
    helpfulCount: 0,
  },
];

// 병원 상세 목록 : API 연동 시 병원 상세·리뷰 조회 API 응답으로 교체
// hospitalId는 hospitalSearchItems와 맞춰 목록에서 진입했을 때 같은 병원이 보이도록 한다.
export const hospitalDetails: HospitalDetail[] = [
  {
    hospitalId: 1,
    hospitalName: '병원명',
    hasDiscount: true,
    rating: '9.8',
    reviewCount: '1529',
    address: '서울 서초구 서초4동',
    treatment: {
      name: '스마일라식',
      promotionCaption: '병원 프로모션용 캡션',
    },
    keywords: [
      '사후관리가 좋았어요',
      '친절한 상담',
      '자가혈청',
      '전문의',
      '최신 장비를 써요',
      '엄청 엄청 길고 긴 키워드가 추출됐어요',
    ],
    relatedReviewCount: 614,
    otherReviewCount: 923,
    qnaCount: 6,
    reviews: richHospitalReviews,
  },
  {
    // 관련 리뷰 10개 미만: 키워드 블러 상태 확인용
    hospitalId: 2,
    hospitalName: '병원명',
    hasDiscount: false,
    rating: '9.5',
    reviewCount: '984',
    address: '서울 강남구 역삼동',
    treatment: {
      name: '스마일라식',
      promotionCaption: '병원 프로모션용 캡션',
    },
    keywords: [],
    relatedReviewCount: 5,
    otherReviewCount: 12,
    qnaCount: 6,
    reviews: fewReviewHospitalReviews,
  },
];

export function findHospitalDetail(hospitalId: number) {
  return hospitalDetails.find((hospital) => hospital.hospitalId === hospitalId);
}
