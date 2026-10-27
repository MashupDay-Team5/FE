export type TreatmentResponse = {
  treatmentId: number;
  name: string;
};

export type TreatmentCategoryResponse = {
  treatmentCategoryId: number;
  name: string;
  treatments: TreatmentResponse[];
};

export type MedicalCategoryResponse = {
  medicalCategoryId: number;
  name: string;
  treatmentCategories: TreatmentCategoryResponse[];
};
