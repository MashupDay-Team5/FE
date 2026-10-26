// 진료 항목(시술) : ERD treatment
export type Treatment = {
  id: number;
  name: string;
};

// 시술 분류 : ERD treatment_category
export type TreatmentCategory = {
  id: number;
  name: string;
  treatments: Treatment[];
};

// 진료과 : ERD medical_category
export type MedicalCategory = {
  id: number;
  name: string;
  treatmentCategories: TreatmentCategory[];
};

// 선택된 진료과와 시술 분류 (treatmentCategoryId가 null이면 '전체')
export type TreatmentScope = {
  medicalCategoryId: number;
  treatmentCategoryId: number | null;
};
