import type {
  HospitalSearchItem,
  HospitalSearchProcedure,
} from '@/types/hospitalSearch';

// 진료 항목 목록 : API 연동 시 GET /api/categories 응답으로 교체
export const hospitalSearchProcedures: HospitalSearchProcedure[] = [
  { id: 1, name: '시력교정술 검진' },
  { id: 2, name: '스마일라식' },
  { id: 3, name: '렌즈삽입술' },
  { id: 4, name: '라식' },
  { id: 5, name: '라섹' },
  { id: 6, name: '투데이라섹' },
  { id: 7, name: '스마일프로' },
  { id: 8, name: '스마트라식' },
  { id: 9, name: '퍼스널아이즈' },
];

// 지역 및 하위 지역 목록 : API 연동 시 GET /api/regions 응답으로 교체
export const hospitalSearchRegions = [
  {
    id: 1,
    name: '서울특별시',
    districts: [
      { id: 101, name: '전체' },
      { id: 102, name: '강남구' },
      { id: 103, name: '서초구' },
      { id: 104, name: '마포구' },
      { id: 105, name: '성북구' },
    ],
  },
  {
    id: 2,
    name: '부산광역시',
    districts: [
      { id: 201, name: '전체' },
      { id: 202, name: '해운대구' },
      { id: 203, name: '수영구' },
    ],
  },
  {
    id: 3,
    name: '인천광역시',
    districts: [
      { id: 301, name: '전체' },
      { id: 302, name: '부평구' },
      { id: 303, name: '남동구' },
    ],
  },
  {
    id: 4,
    name: '경기도',
    districts: [
      { id: 401, name: '전체' },
      { id: 402, name: '성남시' },
      { id: 403, name: '용인시' },
    ],
  },
];

// 병원 검색 결과 목록 : API 연동 시 GET /api/hospitals 응답으로 교체
export const hospitalSearchItems: HospitalSearchItem[] = [
  {
    hospitalId: 1,
    hospitalName: '병원명',
    hasDiscount: true,
    rating: '9.8',
    reviewCount: '1529',
    address: '서울 서초구 서초4동',
    visitCount: 343,
    isReservable: true,
    priceCards: [
      {
        type: 'badge',
        procedureId: 2,
        procedureName: '스마일라식',
        originalPrice: '2,300,000원',
        discountedPrice: '1,240,000원',
        badgeLabel: '9월 특가',
      },
      {
        type: 'default',
        procedureId: 4,
        procedureName: '라식',
        originalPrice: '1,800,000원',
        discountedPrice: '990,000원',
      },
    ],
  },
  {
    hospitalId: 2,
    hospitalName: '병원명',
    hasDiscount: false,
    rating: '9.5',
    reviewCount: '984',
    address: '서울 강남구 역삼동',
    isReservable: false,
    priceCards: [
      {
        type: 'default',
        procedureId: 3,
        procedureName: '렌즈삽입술',
        originalPrice: '3,000,000원',
        discountedPrice: '2,100,000원',
      },
      {
        type: 'free',
        procedureId: 1,
        procedureName: '무료 수술명',
        originalPrice: '0원',
      },
    ],
  },
];
