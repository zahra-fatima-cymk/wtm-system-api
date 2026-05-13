export type UserRole = 'user' | 'driver' | 'admin';

export type Service = {
  id: number;
  name: string;
  description?: string;
  price: number | string;
  service_type?: string;
  is_active?: boolean;
  estimated_duration?: number;
  currency?: string;
};

export type Driver = {
  id: number;
  user_id: number;
  first_name?: string;
  last_name?: string;
  license_number?: string;
  vehicle_type?: string;
  vehicle_plate?: string;
  rating?: number | string;
  verification_status?: string;
  rating_average?: number;
  user?: {
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
  };
};

export type Booking = {
  id: number;
  user_id: number;
  service_id: number;
  driver_id?: number | null;
  booking_date: string;
  scheduled_time: string;
  delivery_address: string;
  special_requests?: string | null;
  status: string;
  quantity: number;
  total_amount: number | string;
  payment_status: string;
  payment_method: string;
  service?: Service;
  driver?: Driver;
  user?: { id?: number; first_name: string; last_name: string; email?: string; phone?: string };
};

export type Payment = {
  id: number;
  booking_id: number;
  user_id: number;
  amount: number | string;
  payment_method: string;
  payment_status: string;
  transaction_id?: string | null;
  receipt_url?: string | null;
  payment_date?: string | null;
  booking?: Booking;
};

export type DriverTask = {
  id: number;
  driver_id: number;
  booking_id: number;
  status: string;
  notes?: string | null;
  started_at?: string | null;
  completed_at?: string | null;
  booking?: Booking;
  driver?: Driver;
  created_at?: string;
  updated_at?: string;
};

export type NotificationItem = {
  id: number;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  booking_id?: number | null;
  created_at?: string;
  read_at?: string | null;
};

export type HistoryRecord = {
  id: number;
  user_id?: number;
  driver_id?: number | null;
  booking_id?: number | null;
  action_type: string;
  description: string;
  status?: string | null;
  amount?: number | string | null;
  created_at?: string;
};

export type Invoice = {
  id: number;
  user_id: number;
  booking_id?: number | null;
  invoice_number?: string;
  status: string;
  total_amount: number | string;
  issue_date?: string | null;
  issued_at?: string | null;
  due_date?: string | null;
};

export type RatingReview = {
  id: number;
  booking_id: number;
  driver_id: number;
  user_id: number;
  rating_score: number;
  review_text?: string | null;
  created_at?: string;
  booking?: Booking;
  driver?: Driver & { first_name?: string; last_name?: string };
  user?: { first_name: string; last_name: string };
};

export type AuthUserProfile = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  type: UserRole;
  phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  status?: string;
  profile_image?: string;
};
