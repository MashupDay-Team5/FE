export type ApiResponse<T> = {
  success: boolean;
  code: string;
  message: string;
  data: T;
};

type ApiQueryPrimitive = string | number | boolean;

export type ApiQueryParams = Record<
  string,
  ApiQueryPrimitive | readonly ApiQueryPrimitive[] | null | undefined
>;

export type ApiGetOptions = {
  params?: ApiQueryParams;
  signal?: AbortSignal;
};
