export enum UserType {
  USER = 'user',
  DRIVER = 'driver',
  ADMIN = 'admin',
}

export enum AccountStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

export enum ServiceType {
  DELIVERY = 'delivery',
  CLEANING = 'cleaning',
  MAINTENANCE = 'maintenance',
  REPAIR = 'repair',
  EMERGENCY = 'emergency',
}

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum TaskStatus {
  ASSIGNED = 'assigned',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export enum PaymentMethod {
  ONLINE = 'online',
  CASH_ON_DELIVERY = 'cash_on_delivery',
}

export enum DriverAvailability {
  AVAILABLE = 'available',
  BUSY = 'busy',
  OFFLINE = 'offline',
}

export enum VerificationStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
}

export enum NotificationType {
  BOOKING = 'booking',
  PAYMENT = 'payment',
  TASK = 'task',
  RATING = 'rating',
  SYSTEM = 'system',
}

export enum InvoiceStatus {
  DRAFT = 'draft',
  ISSUED = 'issued',
  PAID = 'paid',
  CANCELLED = 'cancelled',
}
