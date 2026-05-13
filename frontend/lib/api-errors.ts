import type { AxiosError } from 'axios';

export function getApiErrorMessage(error: unknown, fallback = 'Something went wrong. Please try again.') {
  const err = error as AxiosError<{ message?: string | string[] }>;
  const data = err?.response?.data;
  if (!data) return err?.message ?? fallback;
  const msg = data.message;
  if (Array.isArray(msg)) return msg.join(', ');
  if (typeof msg === 'string' && msg.trim()) return msg;
  return fallback;
}
