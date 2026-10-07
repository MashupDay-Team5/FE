// 통합, 병원, 의료상담, 블로그 탭 값 타입
export type HospitalSearchTab =
  'integrated' | 'hospital' | 'consultation' | 'blog';

// 통합 필터 시트 카테고리 타입
export type HospitalSearchIntegratedFilterCategory =
  'region' | 'price' | 'treatment-condition';

// 통합 필터 시트 진료조건 세부 체크 항목 타입
export type HospitalSearchTreatmentConditionId =
  'specialist' | 'public-price' | 'night-clinic' | 'holiday-clinic';

export type HospitalSearchTreatmentCondition = {
  id: HospitalSearchTreatmentConditionId;
  label: string;
  description?: string;
};

// 가격 슬라이더 최소, 최댓값 타입
export type HospitalSearchPriceRange = {
  min: number;
  max: number;
};

// 선택된 지역, 가격 범위, 진료조건을 묶는 필터 상태 구조
export type HospitalSearchFilterState = {
  regionSelections: HospitalSearchRegionSelection[];
  priceRange: HospitalSearchPriceRange;
  treatmentConditionIds: HospitalSearchTreatmentConditionId[];
};

export type HospitalSearchDistrict = {
  id: number;
  name: string;
};

export type HospitalSearchRegion = {
  id: number;
  name: string;
  districts: HospitalSearchDistrict[];
};

export type HospitalSearchRegionSelection = {
  regionId: number;
  districtId: number;
};

// 가격 카드 타입 (배지, 기본, 무료) 구분
export type HospitalSearchPriceCard =
  | {
      type: 'badge';
      procedureId: number;
      procedureName: string;
      priceAmount: number;
      originalPrice: string;
      discountedPrice: string;
      badgeLabel: string;
    }
  | {
      type: 'default';
      procedureId: number;
      procedureName: string;
      priceAmount: number;
      originalPrice: string;
      discountedPrice: string;
    }
  | {
      type: 'free';
      procedureId: number;
      procedureName: string;
      priceAmount: number;
      originalPrice: string;
      originalPriceLabel?: string;
    };

// ListCard에 전달할 병원 기본 정보와 가격 카드 목록 구조
export type HospitalSearchItem = {
  hospitalId: number;
  hospitalName: string;
  regionId: number;
  districtId: number;
  treatmentConditionIds: HospitalSearchTreatmentConditionId[];
  hasDiscount: boolean;
  rating: string;
  reviewCount: string;
  address: string;
  visitCount?: number;
  isReservable: boolean;
  thumbnailUrl?: string;
  priceCards: HospitalSearchPriceCard[];
};
