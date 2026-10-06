import type { HospitalSearchTreatmentCondition } from '@/types/hospitalSearch';

export const hospitalSearchPriceRange = {
  min: 0,
  max: 1500,
};

export const hospitalSearchPriceUnitInWon = 10000;

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
