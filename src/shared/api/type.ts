import type { components, paths } from './generated-types';

type Operation<TPath extends keyof paths, TMethod extends keyof paths[TPath]> = NonNullable<
  paths[TPath][TMethod]
>;

type RequestBody<TPath extends keyof paths, TMethod extends keyof paths[TPath]> =
  Operation<TPath, TMethod> extends { requestBody: { content: infer TContent } }
    ? TContent extends Record<string, unknown>
      ? TContent[keyof TContent]
      : never
    : never;

type ResponseBody<
  TPath extends keyof paths,
  TMethod extends keyof paths[TPath],
  TStatus extends Operation<TPath, TMethod> extends { responses: infer TResponses }
    ? keyof TResponses
    : never,
> =
  Operation<TPath, TMethod> extends { responses: infer TResponses }
    ? TResponses extends Record<string | number, unknown>
      ? TResponses[TStatus] extends { content: infer TContent }
        ? TContent extends Record<string, unknown>
          ? TContent[keyof TContent]
          : never
        : never
      : never
    : never;

type CookieParams<TPath extends keyof paths, TMethod extends keyof paths[TPath]> =
  Operation<TPath, TMethod> extends { parameters: { cookie: infer TCookie } } ? TCookie : never;

// Common
export type ApiErrorResponse = components['schemas']['ErrorResponse'];
export type ApiResponse = components['schemas']['ApiResponse'];

// Counselor auth
export type CounselorAuthLoginRequest = RequestBody<'/api/v1/counselor/auth/login', 'post'>;
export type CounselorAuthLoginSuccessResponse = ResponseBody<
  '/api/v1/counselor/auth/login',
  'post',
  200
>;

export type CounselorAuthVerifyOtpRequest = RequestBody<
  '/api/v1/counselor/auth/2fa/verify',
  'post'
>;
export type CounselorAuthVerifyOtpSuccessResponse = ResponseBody<
  '/api/v1/counselor/auth/2fa/verify',
  'post',
  200
>;

export type CounselorAuthResendOtpRequest = RequestBody<
  '/api/v1/counselor/auth/2fa/resend',
  'post'
>;
export type CounselorAuthResendOtpSuccessResponse = ResponseBody<
  '/api/v1/counselor/auth/2fa/resend',
  'post',
  200
>;

export type CounselorAuthRefreshCookie = CookieParams<'/api/v1/counselor/auth/refresh', 'post'>;
export type CounselorAuthRefreshSuccessResponse = ResponseBody<
  '/api/v1/counselor/auth/refresh',
  'post',
  200
>;

export type CounselorAuthLogoutCookie = CookieParams<'/api/v1/counselor/auth/logout', 'post'>;
export type CounselorAuthLogoutSuccessResponse = ResponseBody<
  '/api/v1/counselor/auth/logout',
  'post',
  200
>;

// Counselor password reset
export type CounselorPasswordResetRequest = RequestBody<
  '/api/v1/counselor/auth/password-reset',
  'post'
>;
export type CounselorPasswordResetSuccessResponse = ResponseBody<
  '/api/v1/counselor/auth/password-reset',
  'post',
  200
>;

export type CounselorPasswordResetConfirmRequest = RequestBody<
  '/api/v1/counselor/auth/password-reset/confirm',
  'post'
>;
export type CounselorPasswordResetConfirmSuccessResponse = ResponseBody<
  '/api/v1/counselor/auth/password-reset/confirm',
  'post',
  200
>;

// Counselor inquiry
export type CounselorInquirySubmitRequest = RequestBody<'/api/v1/counselors/inquiries', 'post'>;
export type CounselorInquirySubmitSuccessResponse = ResponseBody<
  '/api/v1/counselors/inquiries',
  'post',
  200
>;
