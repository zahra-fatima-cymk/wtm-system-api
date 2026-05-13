# WTM - Water Tank Management System

A comprehensive water tank management system built with NestJS (backend) and Next.js (frontend) for managing water delivery services, bookings, payments, and driver operations.

## 🚀 Features

### Core Functionality
- **Booking Management**: Create and manage water delivery bookings
- **Driver Tasks**: Assign and track driver tasks with status updates
- **Payment Processing**: Handle online and cash-on-delivery payments
- **Real-time Tracking**: Monitor booking and delivery status
- **Rating System**: Customer and driver rating/reviews
- **Notification System**: Automated notifications for all stakeholders
- **User History**: Complete audit trail of all user activities

### Role-Based Access Control
- **Admin**: Full system control and management
- **Driver**: Task management, status updates, cash collection
- **User**: Booking management, payment tracking, service ratings

## 🏗️ Architecture

### Backend (NestJS)
- **Port**: 3333
- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL/MySQL with Sequelize ORM
- **Authentication**: JWT (9-hour expiry)
- **API Documentation**: Swagger/OpenAPI

### Frontend (Next.js)
- **Port**: 4444
- **Framework**: Next.js 16 with TypeScript
- **UI Library**: shadcn/ui with Tailwind CSS
- **State Management**: React Context + Custom Hooks
- **Theme Support**: Light/Dark mode toggle

## 📊 Database Schema

### Core Tables
- **users**: User accounts with role-based access (admin/driver/user)
- **drivers**: Driver profiles with vehicle and rating information
- **services**: Available services (delivery, cleaning, maintenance, etc.)
- **bookings**: Service booking records
- **driver_tasks**: Task assignments for drivers
- **payments**: Payment records (online/cash-on-delivery)
- **ratings_reviews**: Customer feedback and ratings
- **notifications**: System and user notifications
- **user_history**: Complete audit trail
- **invoices**: Billing and invoicing system

All tables include audit fields (`created_by`, `updated_by`, `created_at`, `updated_at`).

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL or MySQL database
- npm or yarn

### 1. Clone and Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Database Setup

```bash
# Navigate to backend directory
cd backend

# Create database and update .env file
cp .env.example .env
# Edit .env with your database credentials

# Run migrations
npm run db:migrate

# Seed initial data
npm run db:seed
```

### 3. Environment Configuration

#### Backend (.env)
```env
PORT=3333
DATABASE_NAME=your_database_name
DATABASE_USER=your_database_user
DATABASE_PASSWORD=your_database_password
DATABASE_HOST=localhost
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=9h
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3333
```

### 4. Run the Application

```bash
# Terminal 1: Start Backend
cd backend
npm run dev

# Terminal 2: Start Frontend
cd frontend
npm run dev
```

### 5. Access the Application

- **Frontend**: http://localhost:4444
- **Backend API**: http://localhost:3333
- **API Documentation**: http://localhost:3333/api/docs

## 👥 Default Users

After seeding, you can login with these accounts:

### Admin
- **Email**: admin@wtm.com
- **Password**: Admin@123

### Driver
- **Email**: driver1@wtm.com
- **Password**: Driver@123

### Customer
- **Email**: user1@wtm.com
- **Password**: User@123

## 📱 User Roles & Permissions

### Admin Dashboard
- View all bookings, payments, and users
- Assign drivers to bookings
- Manage services and system settings
- Access all reports and analytics

### Driver Dashboard
- View assigned tasks
- Update task status (assigned → in_progress → completed)
- Collect cash payments
- View personal ratings and history

### User Dashboard
- Create new bookings
- Track booking status
- View payment history
- Rate completed services
- Access personal history

## 🔧 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/profile` - Get user profile

### Bookings
- `GET /bookings` - List user bookings (role-based)
- `POST /bookings` - Create booking
- `PATCH /bookings/:id/status` - Update booking status
- `PATCH /bookings/:id/assign-driver` - Assign driver (Admin only)

### Payments
- `GET /payments` - List payments
- `POST /payments` - Create payment
- `PATCH /payments/:id/verify` - Verify payment (Admin only)

### Driver Tasks
- `GET /driver-tasks/me` - Get driver's tasks
- `PATCH /driver-tasks/:id` - Update task status

### Ratings
- `GET /ratings/user/me` - User's submitted ratings
- `GET /ratings/driver/me` - Driver's received ratings
- `POST /ratings` - Submit rating

### Notifications
- `GET /notifications` - Get user notifications
- `PUT /notifications/:id/read` - Mark as read

### History
- `GET /history/user` - User activity history

## 🎨 Frontend Features

- **Responsive Design**: Mobile-first approach
- **Dark/Light Theme**: System preference detection
- **Role-based UI**: Dynamic sidebar and content based on user role
- **Real-time Updates**: Automatic data refresh
- **Error Handling**: Comprehensive error states and loading indicators
- **Professional UI**: Modern design with shadcn/ui components

## 🔒 Security Features

- JWT authentication with 9-hour expiry
- Role-based access control (RBAC)
- Input validation and sanitization
- SQL injection prevention
- CORS configuration
- Password hashing with bcrypt

## 📈 Future Enhancements

- Real-time notifications with WebSocket
- GPS tracking integration
- Payment gateway integration
- Mobile app development
- Advanced analytics dashboard
- Multi-language support
- Email/SMS notifications

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Developer

**Zahra Fatima & Aqsa**
- Water Tank Management System Project
- Built with ❤️ using NestJS and Next.js