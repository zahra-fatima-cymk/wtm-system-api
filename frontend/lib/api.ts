import axiosInstance from '@/lib/axios';
import type { AuthUser } from '@/lib/auth';
import type {
  AuthUserProfile,
  Booking,
  Driver,
  DriverTask,
  HistoryRecord,
  Invoice,
  NotificationItem,
  Payment,
  RatingReview,
  Service,
} from '@/lib/types';

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
};

export type LoginResponse = {
  access_token: string;
};

export const login = (payload: LoginPayload) =>
  axiosInstance.post<LoginResponse>('/auth/login', payload).then((res) => res.data);

export const register = (payload: RegisterPayload) =>
  axiosInstance.post<AuthUserProfile>('/auth/register', payload).then((res) => res.data);

export const getProfile = () =>
  axiosInstance.get<AuthUserProfile>('/auth/profile').then((res) => res.data);

export const getServices = () =>
  axiosInstance.get<Service[]>('/services').then((res) => res.data);

export const getBookings = () =>
  axiosInstance.get<Booking[]>('/bookings').then((res) => res.data);

export const getBooking = (id: number) =>
  axiosInstance.get<Booking>(`/bookings/${id}`).then((res) => res.data);

export type CreateBookingPayload = {
  service_id: number;
  booking_date: string;
  scheduled_time: string;
  delivery_address: string;
  special_requests?: string;
  quantity: number;
  payment_method: 'online' | 'cash_on_delivery';
};

export const createBooking = (payload: CreateBookingPayload) =>
  axiosInstance.post<Booking>('/bookings', payload).then((res) => res.data);

export const updateBookingStatus = (bookingId: number, status: string) =>
  axiosInstance.patch<Booking>(`/bookings/${bookingId}/status`, { status }).then((res) => res.data);

export const assignDriverToBooking = (bookingId: number, driver_id: number) =>
  axiosInstance.patch<Booking>(`/bookings/${bookingId}/assign-driver`, { driver_id }).then((res) => res.data);

export const getPayments = () =>
  axiosInstance.get<Payment[]>('/payments').then((res) => res.data);

export type CreatePaymentPayload = {
  booking_id: number;
  amount: number;
  payment_method: 'online' | 'cash_on_delivery';
  transaction_id?: string;
  receipt_url?: string;
};

export const createPayment = (payload: CreatePaymentPayload) =>
  axiosInstance.post<Payment>('/payments', payload).then((res) => res.data);

export const verifyPayment = (paymentId: number, status: 'completed' | 'failed' | 'pending' | 'refunded') =>
  axiosInstance.patch<Payment>(`/payments/${paymentId}/verify`, { status }).then((res) => res.data);

export const getNotifications = () =>
  axiosInstance.get<NotificationItem[]>('/notifications').then((res) => res.data);

export const markNotificationRead = (id: number) =>
  axiosInstance.put<NotificationItem>(`/notifications/${id}/read`).then((res) => res.data);

export const getUserHistory = () =>
  axiosInstance.get<HistoryRecord[]>('/history/user').then((res) => res.data);

export const getDriverHistory = () =>
  axiosInstance.get<HistoryRecord[]>('/history/driver').then((res) => res.data);

export const getAdminHistory = () =>
  axiosInstance.get<HistoryRecord[]>('/history').then((res) => res.data);

export const getMyInvoices = () =>
  axiosInstance.get<Invoice[]>('/invoices/me').then((res) => res.data);

export const getAdminInvoices = () =>
  axiosInstance.get<Invoice[]>('/invoices').then((res) => res.data);

export const getInvoice = (id: number) =>
  axiosInstance.get<Invoice>(`/invoices/${id}`).then((res) => res.data);

export const getDriverTasks = () =>
  axiosInstance.get<DriverTask[]>('/driver-tasks/me').then((res) => res.data);

export const getAllDriverTasks = () =>
  axiosInstance.get<DriverTask[]>('/driver-tasks').then((res) => res.data);

export const updateDriverTask = (id: number, payload: Partial<{ status: string; notes?: string; started_at?: string; completed_at?: string }>) =>
  axiosInstance.patch<DriverTask>(`/driver-tasks/${id}`, payload).then((res) => res.data);

export const getUserRatings = () =>
  axiosInstance.get<RatingReview[]>('/ratings/user/me').then((res) => res.data);

export const getDriverRatings = () =>
  axiosInstance.get<RatingReview[]>('/ratings/driver/me').then((res) => res.data);

export const getAllRatings = () =>
  axiosInstance.get<RatingReview[]>('/ratings').then((res) => res.data);

export const submitRating = (payload: {
  booking_id: number;
  driver_id: number;
  rating_score: number;
  review_text?: string;
  categories?: Record<string, unknown>;
}) => axiosInstance.post<RatingReview>('/ratings', payload).then((res) => res.data);

export const getUsers = () =>
  axiosInstance.get<AuthUserProfile[]>('/users').then((res) => res.data);

export const getDrivers = () =>
  axiosInstance.get<Driver[]>('/drivers').then((res) => res.data);

export const getMyDriverProfile = () =>
  axiosInstance.get<Driver>('/drivers/me').then((res) => res.data);

export type CreateServicePayload = {
  name: string;
  description: string;
  price: number;
  service_type: string;
  estimated_duration: number;
  is_active?: boolean;
  is_emergency?: boolean;
};

export const createService = (payload: CreateServicePayload) =>
  axiosInstance.post<Service>('/services', payload).then((res) => res.data);

export const updateService = (id: number, payload: Partial<CreateServicePayload>) =>
  axiosInstance.patch<Service>(`/services/${id}`, payload).then((res) => res.data);

export const deleteService = (id: number) =>
  axiosInstance.delete(`/services/${id}`).then((res) => res.data);
