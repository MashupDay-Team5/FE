export type HospitalListSort =
  'VISIT' | 'RATING' | 'REVIEW_COUNT' | 'LOW_PRICE';

export type HospitalFilterParams = {
  medicalCategoryId?: number;
  treatmentCategoryId?: number;
  treatmentIds?: readonly number[];
  regionIds?: readonly number[];
  minPrice?: number;
  maxPrice?: number;
  hasSpecialist?: boolean;
  hasPublicPrice?: boolean;
  hasNightClinic?: boolean;
  hasHolidayClinic?: boolean;
  mallId?: number;
};

export type HospitalListParams = HospitalFilterParams & {
  sort?: HospitalListSort;
  page?: number;
  size?: number;
};

export type HospitalRegionResponse = {
  sidoId: number;
  sidoName: string;
  sigunguId: number;
  sigunguName: string;
  dongId: number;
  dongName: string;
};

export type HospitalTreatmentPriceResponse = {
  hospitalTreatmentId: number;
  treatmentId: number;
  treatmentName: string;
  regularPrice: number;
  discountPrice: number | null;
  displayPrice: number;
  priceType: 'REGULAR' | 'MALL';
};

export type HospitalBadgeType =
  | 'POPULAR'
  | 'NIGHT_CLINIC'
  | 'SAME_DAY_BOOKING'
  | 'OPEN_TODAY'
  | 'SPECIAL_OFFER';

export type HospitalResponse = {
  hospitalId: number;
  name: string;
  address: string;
  region: HospitalRegionResponse;
  rating: number;
  reviewCount: number;
  hasSpecialist: boolean;
  hasPublicPrice: boolean;
  hasNightClinic: boolean;
  hasHolidayClinic: boolean;
  badgeTypes: HospitalBadgeType[];
  treatments: HospitalTreatmentPriceResponse[];
};

export type HospitalListResponse = {
  content: HospitalResponse[];
  page: number;
  size: number;
  hasNext: boolean;
};
