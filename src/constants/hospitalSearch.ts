import type { MenuTriggerOption } from '@/components/common/MenuTrigger';
import type { HospitalBadgeType } from '@/types/hospital';
import type {
  HospitalSearchTreatmentCondition,
  HospitalSort,
} from '@/types/hospitalSearch';

export const hospitalBadgeLabels: Record<HospitalBadgeType, string> = {
  POPULAR: '인기 병원',
  NIGHT_CLINIC: '야간 진료',
  SAME_DAY_BOOKING: '당일 예약',
  OPEN_TODAY: '오늘 진료',
  SPECIAL_OFFER: '특가 진행',
};

export const MAX_SELECTED_REGION_COUNT = 5;

export const hospitalSearchPriceRange = {
  min: 0,
  max: 1500,
};

export const hospitalSearchPriceUnitInWon = 10000;
export const hospitalSearchPriceStep = 50;

export const hospitalSearchTreatmentConditions: HospitalSearchTreatmentCondition[] =
  [
    { id: 'specialist', label: '전문의' },
    {
      id: 'public-price',
      label: '가격공개 병원',
      description: '의료기관이 직접 특정 치료항목의 비급여 가격 공개',
    },
    {
      id: 'night-clinic',
      label: '야간진료',
      description: '일주일 중 하루라도 오후 6:30 이후 진료',
    },
    {
      id: 'holiday-clinic',
      label: '휴일진료',
      description: '일요일, 공휴일 중 하루라도 진료',
    },
  ];

// 홈과 검색 결과에서 함께 쓰는 병원 정렬 옵션. 시술을 선택하면 낮은 가격 순을 추가한다.
export const defaultHospitalSortOptions: MenuTriggerOption<HospitalSort>[] = [
  { value: 'most-visited', label: '방문 많은 순' },
  { value: 'highest-rating', label: '평점순' },
  { value: 'most-reviews', label: '리뷰 많은 순' },
];

export const lowestPriceSortOption: MenuTriggerOption<HospitalSort> = {
  value: 'lowest-price',
  label: '낮은 가격 순',
};
