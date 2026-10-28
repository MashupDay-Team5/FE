export type HospitalListSort =
  'VISIT' | 'RATING' | 'REVIEW_COUNT' | 'LOW_PRICE';

export type HospitalListParams = {
  treatmentCategoryId?: number;
  treatmentId?: number;
  regionIds?: readonly number[];
  minPrice?: number;
  maxPrice?: number;
  hasSpecialist?: boolean;
  hasPublicPrice?: boolean;
  hasNightClinic?: boolean;
  hasHolidayClinic?: boolean;
  mallId?: number;
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
  discountPrice: number;
  displayPrice: number;
  priceType: 'REGULAR' | 'MALL';
  isSpecialOffer: boolean;
};

export type HospitalResponse = {
  hospitalId: number;
  name: string;
  region: HospitalRegionResponse;
  rating: number;
  reviewCount: number;
  hasSpecialist: boolean;
  hasPublicPrice: boolean;
  hasNightClinic: boolean;
  hasHolidayClinic: boolean;
  isReservable: boolean;
  treatments: HospitalTreatmentPriceResponse[];
};

export type HospitalListResponse = {
  content: HospitalResponse[];
  page: number;
  size: number;
  hasNext: boolean;
};
