import type { RegionResponse } from '@/types/region';
import { apiGet } from './client';

type GetRegionsOptions = {
  parentId?: number;
  signal?: AbortSignal;
};

export function getRegions({ parentId, signal }: GetRegionsOptions = {}) {
  return apiGet<RegionResponse[]>('/api/regions', {
    params: { parentId },
    signal,
  });
}
