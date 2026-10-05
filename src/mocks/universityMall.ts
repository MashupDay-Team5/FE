import { hospitalSearchProcedures } from '@/mocks/hospitalSearch';
import type {
  HospitalSearchItem,
  HospitalSearchPriceCard,
} from '@/types/hospitalSearch';
import type { MedicalCategory, TreatmentScope } from '@/types/universityMall';

// 진료과 > 시술 분류 > 시술 목록 : API 연동 시 GET /api/categories 응답으로 교체
export const medicalCategories: MedicalCategory[] = [
  {
    id: 1,
    name: '안과',
    treatmentCategories: [
      { id: 11, name: '시력교정술', treatments: hospitalSearchProcedures },
      {
        id: 12,
        name: '노안수술',
        treatments: [
          { id: 1201, name: '노안수술 검진' },
          { id: 1202, name: '노안라식' },
          { id: 1203, name: '노안렌즈삽입술' },
        ],
      },
      {
        id: 13,
        name: '백내장수술',
        treatments: [
          { id: 1301, name: '백내장수술 검진' },
          { id: 1302, name: '백내장 다초점렌즈' },
          { id: 1303, name: '백내장 단초점렌즈' },
        ],
      },
      {
        id: 14,
        name: '드림렌즈',
        treatments: [
          { id: 1401, name: '드림렌즈 검진' },
          { id: 1402, name: '드림렌즈' },
        ],
      },
      { id: 15, name: '안구건조증 IPL', treatments: [] },
      { id: 16, name: '아이링수술', treatments: [] },
      {
        id: 17,
        name: '망막질환',
        treatments: [
          { id: 1701, name: '망막질환 검진' },
          { id: 1702, name: '황반변성 치료' },
        ],
      },
    ],
  },
  {
    id: 2,
    name: '치과',
    treatmentCategories: [
      {
        id: 21,
        name: '교정',
        treatments: [
          { id: 2101, name: '투명교정' },
          { id: 2102, name: '설측교정' },
        ],
      },
      {
        id: 22,
        name: '임플란트',
        treatments: [{ id: 2201, name: '임플란트' }],
      },
      { id: 23, name: '스케일링', treatments: [] },
    ],
  },
  {
    id: 3,
    name: '모발이식',
    treatmentCategories: [
      {
        id: 31,
        name: '모발이식',
        treatments: [
          { id: 3101, name: '절개 모발이식' },
          { id: 3102, name: '비절개 모발이식' },
        ],
      },
    ],
  },
  {
    id: 4,
    name: '건강검진',
    treatmentCategories: [
      {
        id: 41,
        name: '종합검진',
        treatments: [
          { id: 4101, name: '기본 종합검진' },
          { id: 4102, name: '정밀 종합검진' },
        ],
      },
    ],
  },
  {
    id: 5,
    name: '피부과',
    treatmentCategories: [
      {
        id: 51,
        name: '레이저',
        treatments: [
          { id: 5101, name: '레이저 토닝' },
          { id: 5102, name: '피코 레이저' },
        ],
      },
      { id: 52, name: '여드름 치료', treatments: [] },
    ],
  },
  {
    id: 6,
    name: '성형외과',
    treatmentCategories: [
      {
        id: 61,
        name: '눈성형',
        treatments: [
          { id: 6101, name: '쌍꺼풀' },
          { id: 6102, name: '눈매교정' },
        ],
      },
      { id: 62, name: '코성형', treatments: [] },
    ],
  },
  {
    id: 7,
    name: '내과',
    treatmentCategories: [{ id: 71, name: '위·대장 내시경', treatments: [] }],
  },
  {
    id: 8,
    name: '한의원',
    treatmentCategories: [{ id: 81, name: '추나요법', treatments: [] }],
  },
  {
    id: 9,
    name: '비뇨기과',
    treatmentCategories: [{ id: 91, name: '비뇨기 검진', treatments: [] }],
  },
];

// 피그마 기본 선택값: 안과 · 시력교정술
export const defaultTreatmentScope: TreatmentScope = {
  medicalCategoryId: 1,
  treatmentCategoryId: 11,
};

const smileLasikCards: HospitalSearchPriceCard[] = [
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
  {
    type: 'default',
    procedureId: 5,
    procedureName: '라섹',
    originalPrice: '1,600,000원',
    discountedPrice: '890,000원',
  },
];

const lensCards: HospitalSearchPriceCard[] = [
  {
    type: 'default',
    procedureId: 2,
    procedureName: '스마일라식',
    originalPrice: '2,300,000원',
    discountedPrice: '1,240,000원',
  },
  {
    type: 'default',
    procedureId: 3,
    procedureName: '렌즈삽입술',
    originalPrice: '3,000,000원',
    discountedPrice: '2,100,000원',
  },
  {
    type: 'default',
    procedureId: 1,
    procedureName: '시력교정술 검진',
    originalPrice: '50,000원',
    discountedPrice: '30,000원',
  },
];

// 할인몰 홈 병원 목록 (더보기 확인용 20개) : API 연동 시 GET /api/hospitals 응답으로 교체
export const universityMallHospitals: HospitalSearchItem[] = Array.from(
  { length: 20 },
  (_, index) => ({
    hospitalId: index + 1,
    hospitalName: '병원명',
    regionId: 1,
    districtId: 116,
    hasDiscount: true,
    rating: '9.8',
    reviewCount: '1529',
    address: '서울 서초구 서초4동',
    visitCount: 343,
    isReservable: true,
    priceCards: index % 2 === 0 ? smileLasikCards : lensCards,
  }),
);
