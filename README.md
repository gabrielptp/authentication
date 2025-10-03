# Authentication API (Nest.js + Redis)

A secure and fast authentication API built with **Nest.js** and **Redis**.  
Provides RESTful JSON endpoints for creating and authenticating users with proper error handling and password complexity checks.


## 🚀 Quick Start

### Option 1: Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Start Redis in Docker
npm run docker:redis

# 3. Run the API locally
npm run dev

# 4. Stop Redis when done
npm run docker:redis:stop
```

**API will be available at:** `http://localhost:3000`

### Option 2: Run with Docker

```bash
# Run the entire stack (API + Redis) in Docker
npm run docker:test
```

**API will be available at:** `http://localhost:3000`



## 📋 API Endpoints

### User Registration
```http
POST /users/register
Content-Type: application/json

{
  "username": "user@example.com",
  "password": "TestPass123!"
}
```

### User Verification
```http
POST /users/verify
Content-Type: application/json

{
  "username": "user@example.com",
  "password": "TestPass123!"
}
```

### Health Check
```http
GET /
```


## ✨ Features

- **User Registration**: Create new users with unique username validation
- **User Authentication**: Verify user credentials with proper HTTP status codes
- **Security Headers**: Helmet middleware for enhanced security
- **Password Security**: bcrypt hashing with 12 salt rounds
- **Input Validation**: Class-validator for request validation
- **Redis Storage**: Fast, in-memory user data storage
- **Error Handling**: Structured JSON error responses
- **CORS Enabled**: Cross-origin resource sharing support



## 🛠️ Available Scripts

- `npm run dev` - Run locally with ts-node
- `npm run dev:watch` - Run locally with file watching
- `npm run docker:test` - Run full stack in Docker for testing
- `npm run docker:redis` - Start only Redis for local development
- `npm run docker:redis:stop` - Stop Redis
- `npm run build` - Build for production
- `npm run start` - Run production build
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run test:cov` - Run tests with coverage  


## 🔧 Development

### Environment Variables
- `PORT` - API port (default: 3000)
- `REDIS_HOST` - Redis host (default: localhost)
- `REDIS_PORT` - Redis port (default: 6379)


## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e

# Run tests with coverage
npm run test:cov
```
