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

# Start Redis
npm run docker:redis

# Run the API
npm run dev

# API available at: http://localhost:3000
```

### Docker Option
```bash
npm run docker:test  # Run full stack (API + Redis)
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

---

## 🛠️ Technology Stack

- **Backend**: NestJS, TypeScript, Node.js
- **Database**: Redis with ioredis client
- **Security**: bcryptjs, Helmet, class-validator
- **Testing**: Jest, Supertest
- **DevOps**: Docker, Docker Compose

---

## 🛠️ Scripts

```bash
npm run dev          # Development server
npm run build        # Build for production
npm run test         # Run all tests
npm run test:unit    # Unit tests only
npm run test:e2e     # E2E tests
npm run docker:redis # Start Redis
```

---

## 🔧 Configuration

### Environment Variables
```bash
NODE_ENV=development
PORT=3000
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=optional
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
