'use client';

import { useMutation } from '@tanstack/react-query';
import { resend2FA, verify2FA } from '../api/2fa';

export const useVerify2FAMutation = () =>
  useMutation({
    mutationFn: verify2FA,
  });

export const useResend2FAMutation = () =>
  useMutation({
    mutationFn: resend2FA,
  });
