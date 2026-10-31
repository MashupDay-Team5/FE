import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getRegions } from '@/api/regions';
import type {
  HospitalSearchDistrict,
  HospitalSearchRegion,
} from '@/types/hospitalSearch';
import type { RegionResponse } from '@/types/region';

type LoadStatus = 'loading' | 'error' | 'success';
type DistrictState = {
  status: LoadStatus;
  districts: HospitalSearchDistrict[];
};

export type HospitalRegionOptions = {
  regions: HospitalSearchRegion[];
  status: LoadStatus;
  districtStatuses: Record<number, LoadStatus>;
  loadDistricts: (regionId: number, force?: boolean) => void;
  retryRegions: () => void;
};

export function useHospitalRegions(): HospitalRegionOptions {
  const [parents, setParents] = useState<RegionResponse[]>([]);
  const [status, setStatus] = useState<LoadStatus>('loading');
  const [requestCount, setRequestCount] = useState(0);
  const [districtStates, setDistrictStates] = useState<
    Record<number, DistrictState>
  >({});
  const districtCache = useRef<Record<number, DistrictState>>({});
  const districtRequests = useRef(new Map<number, AbortController>());

  useEffect(() => {
    const controller = new AbortController();
    const requests = districtRequests.current;
    const cache = districtCache.current;

    getRegions({ signal: controller.signal })
      .then((response) => {
        if (!controller.signal.aborted) {
          setParents(
            response.filter(({ regionType }) => regionType === 'SIDO'),
          );
          setStatus('success');
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) setStatus('error');
      });

    return () => {
      controller.abort();
      for (const [regionId, request] of requests) {
        request.abort();
        delete cache[regionId];
      }
      requests.clear();
    };
  }, [requestCount]);

  const loadDistricts = useCallback((regionId: number, force = false) => {
    if (
      (!force && districtCache.current[regionId]?.status === 'success') ||
      districtRequests.current.has(regionId)
    )
      return;

    const controller = new AbortController();
    districtRequests.current.set(regionId, controller);
    const update = (state: DistrictState) => {
      districtCache.current[regionId] = state;
      setDistrictStates((current) => ({ ...current, [regionId]: state }));
    };
    update({ status: 'loading', districts: [] });
    getRegions({ parentId: regionId, signal: controller.signal })
      .then((response) => {
        if (!controller.signal.aborted) {
          update({
            status: 'success',
            districts: response
              .filter(({ regionType }) => regionType === 'SIGUNGU')
              .map(({ regionId: districtId, name }) => ({
                id: districtId,
                name,
              })),
          });
        }
      })
      .catch(() => {
        if (!controller.signal.aborted)
          update({ status: 'error', districts: [] });
      })
      .finally(() => {
        if (districtRequests.current.get(regionId) === controller)
          districtRequests.current.delete(regionId);
      });
  }, []);

  const regions = useMemo(
    () =>
      parents.map(({ regionId, name }) => ({
        id: regionId,
        name,
        districts: [
          { id: regionId, name: '전체' },
          ...(districtStates[regionId]?.districts ?? []),
        ],
      })),
    [parents, districtStates],
  );

  const districtStatuses = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(districtStates).map(([regionId, state]) => [
          regionId,
          state.status,
        ]),
      ),
    [districtStates],
  );

  return {
    regions,
    status,
    districtStatuses,
    loadDistricts,
    retryRegions: () => {
      setStatus('loading');
      setRequestCount((count) => count + 1);
    },
  };
}
