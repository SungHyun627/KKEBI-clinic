'use client';

import { useMutation } from '@tanstack/react-query';
import { login } from '../api/login';

export const useLoginMutation = () =>
  useMutation({
    mutationFn: login,
  });
