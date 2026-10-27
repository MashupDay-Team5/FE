import type { MedicalCategoryResponse } from '@/types/category';
import { apiGet } from './client';

export function getCategories(signal?: AbortSignal) {
  return apiGet<MedicalCategoryResponse[]>('/api/categories', { signal });
}
