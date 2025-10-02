# Authentication API (Nest.js + Redis)

A secure and fast authentication API built with **Nest.js** and **Redis**.  
Provides RESTful JSON endpoints for creating and authenticating users with proper error handling and password complexity checks.

---

## Quick Start

### Local Development
```bash
# 1. Start Redis
npm run docker:redis

# 2. Install dependencies
npm install

# 3. Run locally
npm run dev

# 4. Stop Redis when done
npm run docker:redis:stop
```

### Docker Testing
```bash
# Run full stack in Docker
npm run docker:test
```

---

## Available Scripts

- `npm run dev` - Run locally with ts-node
- `npm run dev:watch` - Run locally with file watching
- `npm run docker:test` - Run full stack in Docker for testing
- `npm run docker:redis` - Start only Redis for local development
- `npm run docker:redis:stop` - Stop Redis

---

## Features
- User registration with unique username validation  
- Secure password hashing and complexity validation  
- User authentication endpoint with 200/401 responses  
- JSON-based structured error handling  
- Redis as the data store for user credentials  
- Annotations for areas of future security improvements  

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
