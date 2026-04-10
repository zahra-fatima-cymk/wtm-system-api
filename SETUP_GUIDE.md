# WTM System API - Setup Documentation

## ✅ Completed Setup

Your NestJS project has been successfully configured with:

### 1. **MySQL Database Integration**
- **Driver**: MySQL2
- **ORM**: Sequelize with TypeScript support
- **Configuration File**: `src/config/database.config.ts`

### 2. **Swagger API Documentation**
- **Package**: @nestjs/swagger with swagger-ui-express
- **Access**: http://localhost:4000/api/docs
- **Auto-generated**: All endpoints are documented with decorators

### 3. **Environment Configuration**
- **File**: `.env` (root directory)
- **Credentials**:
  - Host: `localhost`
  - Port: `3306`
  - User: `root`
  - Password: `admin`
  - Database: `wtm`

---

## 📁 Project Structure

```
src/
├── config/
│   └── database.config.ts          # Sequelize configuration
├── models/
│   └── user.model.ts               # User entity (sample)
├── users/
│   ├── dto/
│   │   ├── create-user.dto.ts
│   │   └── update-user.dto.ts
│   ├── users.controller.ts         # CRUD endpoints
│   ├── users.service.ts            # Business logic
│   └── users.module.ts             # Module definition
├── app.module.ts                   # Main application module
├── app.controller.ts
├── app.service.ts
└── main.ts                         # Bootstrap with Swagger
```

---

## 🚀 Getting Started

### 1. **Ensure MySQL is Running**
```bash
# On Windows, if MySQL is installed locally
# Make sure MySQL service is running
# Or use Docker:
docker run --name wtm-mysql -e MYSQL_ROOT_PASSWORD=admin -e MYSQL_DATABASE=wtm -p 3306:3306 -d mysql:8
```

### 2. **Install Dependencies** (Already Done ✅)
```bash
npm install
```

### 3. **Run Development Server**
```bash
npm run dev
```

### 4. **Access Swagger UI**
Open your browser and navigate to:
```
http://localhost:4000/api/docs
```

### 5. **Build for Production**
```bash
npm run build
npm run start:prod
```

---

## 📚 Available API Endpoints

All endpoints are documented in Swagger at `/api/docs`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/users` | Create a new user |
| GET | `/users` | Get all users |
| GET | `/users/:id` | Get user by ID |
| PATCH | `/users/:id` | Update a user |
| DELETE | `/users/:id` | Delete a user |

### Sample Request (Create User)
```bash
curl -X POST http://localhost:4000/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "status": "active"
  }'
```

---

## ⚙️ Configuration Files

### `.env` (Database Credentials)
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=admin
DB_NAME=wtm
PORT=4000
NODE_ENV=development
```

### `src/config/database.config.ts`
- Auto-loads models from `src/models/**/*.model.ts`
- Auto-synchronizes schema in development mode
- Enables detailed SQL logging in development

---

## 🛠️ Adding New Models/Entities

### 1. Create a new model file `src/models/product.model.ts`:
```typescript
import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement } from 'sequelize-typescript';

@Table({
  tableName: 'products',
  timestamps: true,
})
export class Product extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @Column(DataType.STRING)
  name: string;

  @Column(DataType.DECIMAL(10, 2))
  price: number;

  @Column(DataType.TEXT)
  description: string;
}
```

### 2. Create DTOs in `src/products/dto/`:
```typescript
// create-product.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsString()
  description: string;
}
```

### 3. Create service and controller following the users pattern

### 4. Import the model in Sequelize Module in `app.module.ts`

---

## 🔍 Database Features

- **Auto Synchronization**: Tables are automatically created/updated in development
- **Timestamps**: All models automatically include `createdAt` and `updatedAt`
- **Validation**: class-validator and class-transformer for DTO validation
- **Logging**: SQL queries logged to console in development mode

---

## ❓ Questions & Support

Do you have any questions about:
1. Adding more database models?
2. Configuring the database connection?
3. Setting up relationships between models?
4. Adding authentication/authorization?
5. Deploying to production?

Let me know and I can help!

---

## 📌 Next Steps

1. **Start the server**: `npm run dev`
2. **Test endpoints in Swagger**: http://localhost:4000/api/docs
3. **Check MySQL logs**: Verify that tables are being created
4. **Add more models**: Follow the same pattern as User model
5. **Deploy**: Configure environment variables for production

Enjoy! 🎉
