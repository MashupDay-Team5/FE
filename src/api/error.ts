export type ApiErrorKind = 'CONFIG' | 'NETWORK' | 'HTTP' | 'SERVER' | 'PARSE';

type ApiErrorOptions = {
  kind: ApiErrorKind;
  status?: number;
  code?: string;
  cause?: unknown;
};

export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly status: number | undefined;
  readonly code: string | undefined;

  constructor(message: string, options: ApiErrorOptions) {
    super(message, { cause: options.cause });
    this.name = 'ApiError';
    this.kind = options.kind;
    this.status = options.status;
    this.code = options.code;
  }
}
