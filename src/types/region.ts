export type RegionType = 'SIDO' | 'SIGUNGU' | 'DONG';

export type RegionResponse = {
  regionId: number;
  name: string;
  regionType: RegionType;
};
