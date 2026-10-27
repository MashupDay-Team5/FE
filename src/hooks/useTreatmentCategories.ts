import { useOutletContext } from 'react-router-dom';
import type { MedicalCategory } from '@/types/treatment';

export type TreatmentCategoriesContext = {
  categories: MedicalCategory[];
  status: 'loading' | 'error' | 'success';
  retry: () => void;
};

export function useTreatmentCategories() {
  return useOutletContext<TreatmentCategoriesContext>();
}
