import type { ApiGetOptions, ApiResponse } from '@/types/api';
import { ApiError } from './error';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isApiResponse(value: unknown): value is ApiResponse<unknown> {
  return (
    isRecord(value) &&
    typeof value.success === 'boolean' &&
    typeof value.code === 'string' &&
    typeof value.message === 'string' &&
    'data' in value
  );
}

function getRequestUrl(path: string, params: ApiGetOptions['params']) {
  const baseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

  if (!baseUrl) {
    throw new ApiError('VITE_API_BASE_URL을 설정해주세요.', { kind: 'CONFIG' });
  }

  let requestUrl: URL;

  try {
    const parsedBaseUrl = new URL(baseUrl);

    if (
      !['https:', 'http:'].includes(parsedBaseUrl.protocol) ||
      parsedBaseUrl.search ||
      parsedBaseUrl.hash
    ) {
      throw new Error('유효하지 않은 API 기본 주소입니다.');
    }

    requestUrl = new URL(
      `${baseUrl.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`,
    );
  } catch (cause) {
    throw new ApiError('VITE_API_BASE_URL에 올바른 HTTP 주소를 설정해주세요.', {
      kind: 'CONFIG',
      cause,
    });
  }

  for (const [key, value] of Object.entries(params ?? {})) {
    if (value === null || value === undefined) {
      continue;
    }

    const values = Array.isArray(value) ? value : [value];

    for (const entry of values) {
      requestUrl.searchParams.append(key, String(entry));
    }
  }

  return requestUrl;
}

export async function apiGet<T>(
  path: string,
  { params, signal }: ApiGetOptions = {},
): Promise<T> {
  const url = getRequestUrl(path, params);
  let response: Response;
  let responseText: string;

  try {
    response = await fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal,
    });
    responseText = await response.text();
  } catch (cause) {
    if (signal?.aborted) {
      throw cause;
    }

    throw new ApiError(
      '서버에 연결하지 못했습니다. 잠시 후 다시 시도해주세요.',
      {
        kind: 'NETWORK',
        cause,
      },
    );
  }

  let payload: unknown;

  try {
    payload = JSON.parse(responseText);
  } catch (cause) {
    throw new ApiError(
      response.ok
        ? '서버 응답을 JSON으로 읽을 수 없습니다.'
        : `요청에 실패했습니다. (${response.status})`,
      {
        kind: response.ok ? 'PARSE' : 'HTTP',
        status: response.status,
        cause,
      },
    );
  }

  if (!response.ok) {
    throw new ApiError(
      isRecord(payload) && typeof payload.message === 'string'
        ? payload.message
        : `요청에 실패했습니다. (${response.status})`,
      {
        kind: 'HTTP',
        status: response.status,
        code:
          isRecord(payload) && typeof payload.code === 'string'
            ? payload.code
            : undefined,
      },
    );
  }

  if (!isApiResponse(payload)) {
    throw new ApiError('서버의 공통 응답 형식이 올바르지 않습니다.', {
      kind: 'PARSE',
      status: response.status,
    });
  }

  if (!payload.success) {
    throw new ApiError(payload.message, {
      kind: 'SERVER',
      status: response.status,
      code: payload.code,
    });
  }

  return payload.data as T;
}
