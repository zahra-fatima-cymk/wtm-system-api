export const SYSTEM_CONSTANTS = {
  CURRENCY: 'SAR',
  LOCATION: 'Saudi Arabia',
  REGION: ['Jeddah', 'Mecca Region'],
  DEFAULT_TAX_RATE: 0.15, // 15% VAT in Saudi Arabia
};

export const ROLES = {
  ADMIN: 'admin',
  DRIVER: 'driver',
  USER: 'user',
};

export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [
    'users.manage',
    'drivers.manage',
    'services.manage',
    'bookings.manage',
    'payments.manage',
    'reports.view',
  ],
  [ROLES.DRIVER]: [
    'tasks.view',
    'tasks.update',
    'payments.cod.process',
    'profile.view',
  ],
  [ROLES.USER]: [
    'bookings.create',
    'bookings.view',
    'payments.create',
    'profile.view',
  ],
};
