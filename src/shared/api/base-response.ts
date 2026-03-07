export interface ApiResponse<TData = unknown> {
  code?: string;
  message?: string;
  data?: TData;
}

export interface BaseResponseResult<TData = unknown> {
  success: boolean;
  code?: string;
  message?: string;
  data?: TData;
}

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

export const isApiResponse = <TData = unknown>(value: unknown): value is ApiResponse<TData> => {
  if (!isObject(value)) return false;
  return 'code' in value || 'message' in value || 'data' in value;
};

export const toBaseResponse = <TData = unknown>(value: unknown): BaseResponseResult<TData> => {
  if (!isApiResponse<TData>(value)) {
    return {
      success: false,
      message: 'Invalid API response format',
    };
  }

  const response = value as ApiResponse<TData>;
  return {
    success: response.code === 'SUCCESS',
    code: response.code,
    message: response.message,
    data: response.data,
  };
};
