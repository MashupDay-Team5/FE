import type {
  HospitalSearchItem,
  HospitalSearchPriceCard,
} from '@/types/hospitalSearch';

const smileLasikCards: HospitalSearchPriceCard[] = [
  {
    type: 'badge',
    procedureId: 2,
    procedureName: '스마일라식',
    priceAmount: 1240000,
    originalPrice: '2,300,000원',
    discountedPrice: '1,240,000원',
    badgeLabel: '9월 특가',
  },
  {
    type: 'default',
    procedureId: 4,
    procedureName: '라식',
    priceAmount: 990000,
    originalPrice: '1,800,000원',
    discountedPrice: '990,000원',
  },
  {
    type: 'default',
    procedureId: 5,
    procedureName: '라섹',
    priceAmount: 890000,
    originalPrice: '1,600,000원',
    discountedPrice: '890,000원',
  },
];

const lensCards: HospitalSearchPriceCard[] = [
  {
    type: 'default',
    procedureId: 2,
    procedureName: '스마일라식',
    priceAmount: 1240000,
    originalPrice: '2,300,000원',
    discountedPrice: '1,240,000원',
  },
  {
    type: 'default',
    procedureId: 3,
    procedureName: '렌즈삽입술',
    priceAmount: 2100000,
    originalPrice: '3,000,000원',
    discountedPrice: '2,100,000원',
  },
  {
    type: 'default',
    procedureId: 1,
    procedureName: '시력교정술 검진',
    priceAmount: 30000,
    originalPrice: '50,000원',
    discountedPrice: '30,000원',
  },
];

// 안과 외 진료 범위 확인용 가격 카드
const orthodonticCards: HospitalSearchPriceCard[] = [
  {
    type: 'badge',
    procedureId: 2101,
    procedureName: '투명교정',
    priceAmount: 4500000,
    originalPrice: '6,000,000원',
    discountedPrice: '4,500,000원',
    badgeLabel: '9월 특가',
  },
  {
    type: 'default',
    procedureId: 2102,
    procedureName: '설측교정',
    priceAmount: 6800000,
    originalPrice: '8,000,000원',
    discountedPrice: '6,800,000원',
  },
];

const implantCards: HospitalSearchPriceCard[] = [
  {
    type: 'default',
    procedureId: 2201,
    procedureName: '임플란트',
    priceAmount: 1100000,
    originalPrice: '1,500,000원',
    discountedPrice: '1,100,000원',
  },
  {
    type: 'default',
    procedureId: 2101,
    procedureName: '투명교정',
    priceAmount: 4700000,
    originalPrice: '5,800,000원',
    discountedPrice: '4,700,000원',
  },
];

const laserCards: HospitalSearchPriceCard[] = [
  {
    type: 'default',
    procedureId: 5101,
    procedureName: '레이저 토닝',
    priceAmount: 59000,
    originalPrice: '100,000원',
    discountedPrice: '59,000원',
  },
  {
    type: 'default',
    procedureId: 5102,
    procedureName: '피코 레이저',
    priceAmount: 99000,
    originalPrice: '150,000원',
    discountedPrice: '99,000원',
  },
];

const hairTransplantCards: HospitalSearchPriceCard[] = [
  {
    type: 'default',
    procedureId: 3102,
    procedureName: '비절개 모발이식',
    priceAmount: 3900000,
    originalPrice: '5,000,000원',
    discountedPrice: '3,900,000원',
  },
];

const createHospital = (
  hospitalId: number,
  priceCards: HospitalSearchPriceCard[],
): HospitalSearchItem => ({
  hospitalId,
  hospitalName: '병원명',
  regionId: 1,
  districtId: 116,
  treatmentConditionIds: [],
  hasDiscount: true,
  rating: '9.8',
  reviewCount: '1529',
  address: '서울 서초구 서초4동',
  visitCount: 343,
  isReservable: true,
  priceCards,
});

// 할인몰 홈 병원 목록 : API 연동 시 GET /api/hospitals 응답으로 교체
// 안과 20개(더보기 확인용)와 치과·피부과·모발이식 일부만 두어, 나머지 진료 범위는 빈 상태를 확인할 수 있다.
export const universityMallHospitals: HospitalSearchItem[] = [
  ...Array.from({ length: 20 }, (_, index) =>
    createHospital(index + 1, index % 2 === 0 ? smileLasikCards : lensCards),
  ),
  createHospital(21, orthodonticCards),
  createHospital(22, implantCards),
  createHospital(23, orthodonticCards),
  createHospital(24, laserCards),
  createHospital(25, laserCards),
  createHospital(26, hairTransplantCards),
];
