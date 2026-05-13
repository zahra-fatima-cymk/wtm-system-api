import axiosInstance from '@/lib/axios';
import type { AuthUser } from '@/lib/auth';

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone: string;
  address?: string;
  city?: string;
  postal_code?: string;
  type?: 'user' | 'driver' | 'admin';
};

export type LoginResponse = {
  access_token: string;
};

export const login = (payload: LoginPayload) =>
  axiosInstance.post<LoginResponse>('/auth/login', payload).then((res) => res.data);

export const register = (payload: RegisterPayload) =>
  axiosInstance.post<AuthUser>('/auth/register', payload).then((res) => res.data);

export const getProfile = () =>
  axiosInstance.get<AuthUser>('/auth/profile').then((res) => res.data);

export const getBookings = () =>
  axiosInstance.get<any[]>('/bookings').then((res) => res.data);

export const getPayments = () =>
  axiosInstance.get<any[]>('/payments').then((res) => res.data);

export const getNotifications = () =>
  axiosInstance.get<any[]>('/notifications').then((res) => res.data);

export const getHistory = () =>
  axiosInstance.get<any[]>('/history/user').then((res) => res.data);

export const getInvoices = () =>
  axiosInstance.get<any[]>('/invoices/me').then((res) => res.data);

export const getDriverTasks = () =>
  axiosInstance.get<any[]>('/driver-tasks').then((res) => res.data);

export const getUserRatings = () =>
  axiosInstance.get<any[]>('/ratings/user/me').then((res) => res.data);

export const getDriverRatings = () =>
  axiosInstance.get<any[]>('/ratings/driver/me').then((res) => res.data);

export const getAllRatings = () =>
  axiosInstance.get<any[]>('/ratings').then((res) => res.data);

export const submitRating = (payload: {
  booking_id: number;
  driver_id: number;
  rating_score: number;
  review_text: string;
  categories?: Record<string, unknown>;
}) => axiosInstance.post<any>('/ratings', payload).then((res) => res.data);

export const markNotificationRead = (id: number) =>
  axiosInstance.put<any>(`/notifications/${id}/read`).then((res) => res.data);

export const updateBookingStatus = (bookingId: number, status: string) =>
  axiosInstance.patch<any>(`/bookings/${bookingId}/status`, { status }).then((res) => res.data);
