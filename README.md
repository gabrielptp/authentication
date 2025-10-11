# Authentication API (Nest.js + Redis)

A secure authentication API built with **Nest.js** and **Redis**.  
Provides RESTful endpoints for user registration and authentication with enterprise-grade security.

[![Node.js](https://img.shields.io/badge/Node.js-24-green.svg)](https://nodejs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-11-red.svg)](https://nestjs.com/)
[![Redis](https://img.shields.io/badge/Redis-7-red.svg)](https://redis.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start databases (Redis + PostgreSQL)
npm run docker:dev

# Run the API
npm run dev

# API available at: http://localhost:3000
```

### Docker Option
```bash
npm run docker:test  # Run full stack (API + Redis + PostgreSQL)
```

### React Frontend
```bash
# Open the product catalog interface
open client/index.html

# Or serve with Python
cd client && python3 -m http.server 8080
# Visit: http://localhost:8080
```

---

## 📋 API Endpoints

### User Registration
```http
POST /users/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "TestPass123!"
}
```

### User Verification
```http
POST /users/verify
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "TestPass123!"
}
```

### Product Catalog

#### Generate Products
```http
POST /products/generate
```
Generates 100 sample products in PostgreSQL database.

#### Get All Products
```http
GET /products
```
Returns all products from the database.

#### Search Products
```http
GET /products/search?category=Electronics&minPrice=100&maxPrice=500&limit=10
```

**Query Parameters:**
- `name` - Filter by product name (partial match)
- `category` - Filter by category (partial match)
- `brand` - Filter by brand (partial match)
- `sku` - Filter by SKU (partial match)
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter
- `minStock` - Minimum stock quantity
- `maxStock` - Maximum stock quantity
- `limit` - Results per page (default: 20, max: 100)
- `offset` - Pagination offset (default: 0)

**Example Response:**
```json
{
  "success": true,
  "data": {
    "products": [...],
    "total": 25,
    "limit": 10,
    "offset": 0
  }
}
```

### Health Check
```http
GET /
```

**Rate Limits:** Register (3/min), Verify (5/min), Default (10/min)

---

## ✨ Key Features

- **🔐 Security**: bcrypt password hashing, rate limiting, security headers
- **⚡ Performance**: Redis storage with atomic operations
- **🛡️ Validation**: Strong password requirements, input validation
- **🧪 Testing**: 8 unit tests, E2E tests, comprehensive coverage
- **🐳 Docker**: Full containerization with multi-stage builds
- **📊 Monitoring**: Health checks, structured logging
- **🔧 Config**: Environment-based configuration management
- **📦 Product Catalog**: PostgreSQL-based product management with sample data generation

---

## 🛠️ Technology Stack

- **Backend**: NestJS, TypeScript, Node.js
- **Databases**: PostgreSQL, Redis with ioredis client
- **ORM**: TypeORM for PostgreSQL
- **Security**: bcryptjs, Helmet, class-validator
- **Testing**: Jest, Supertest
- **DevOps**: Docker, Docker Compose

---

## 🛠️ Scripts

```bash
npm run dev              # Development server
npm run build            # Build for production
npm run test             # Run all tests
npm run test:unit        # Unit tests only
npm run test:e2e         # E2E tests
npm run docker:redis     # Start Redis only
npm run docker:postgres  # Start PostgreSQL only
npm run docker:dev       # Start Redis + PostgreSQL
npm run docker:dev:stop  # Stop all databases
```

---

## 🔧 Configuration

### Environment Variables
```bash
NODE_ENV=development
PORT=3000

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=optional

# PostgreSQL Configuration
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=authentication

# CORS Configuration
CORS_ORIGINS=http://localhost:3000,http://localhost:3001,https://yourdomain.com
```

### Password Requirements
- 8-16 characters
- Uppercase, lowercase, number, special character (@$!%*?&)

---

## 🧪 Testing

```bash
npm test         # All tests (8 unit + E2E)
npm run test:cov # With coverage report
```

**Test Coverage:**
- ✅ User registration flow
- ✅ User authentication flow  
- ✅ Error handling scenarios
- ✅ Security validations
- ✅ Redis operations

---

## 🚀 Future Improvements

### **🔐 Security Enhancements**
1. **JWT Token Authentication** - Stateless auth with refresh tokens
2. **Two-Factor Authentication (2FA)** - SMS/Email/TOTP-based security
3. **OAuth2 Integration** - Google, GitHub, Microsoft login
4. **Password Reset System** - Secure email-based password recovery

### **📊 Monitoring & Analytics**
5. **Metrics & Health Monitoring** - Prometheus/Grafana integration
6. **Error Tracking** - Sentry integration for production monitoring

### **🏗️ Architecture Improvements**
7. **Database Migration** - PostgreSQL/MySQL as primary store with Redis caching
8. **Microservices Architecture** - Split into auth, user, and notification services

### **👥 User Management**
9. **Role-Based Access Control (RBAC)** - User roles and permissions system
10. **User Profile Management** - Extended user data and preferences
