<div align="center">

# Dream News

**A modern, full-stack news aggregation platform built with enterprise-grade architecture**

[![NestJS](https://img.shields.io/badge/NestJS-11-E0234E?style=flat-square&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Turborepo](https://img.shields.io/badge/Turborepo-2-EF4444?style=flat-square&logo=turborepo&logoColor=white)](https://turbo.build/)
[![Vitest](https://img.shields.io/badge/Tested_with-Vitest-6E9F18?style=flat-square&logo=vitest&logoColor=white)](https://vitest.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

[Features](#features) &bull; [Tech Stack](#tech-stack) &bull; [Architecture](#architecture) &bull; [Getting Started](#getting-started) &bull; [Scripts](#scripts) &bull; [API](#api-endpoints) &bull; [Testing](#testing)

</div>

---

## Features

- **News Feed** with infinite scroll, category filtering, and full-text search
- **Article Pages** with server-side rendering for SEO
- **Comments System** with real-time CRUD operations
- **Authentication** &mdash; JWT-based with httpOnly cookie refresh tokens, email activation
- **Admin Dashboard** &mdash; user management, external news fetching (Cybersport, The Guardian)
- **User Profiles** &mdash; nickname editing, secure password change
- **Role-Based Access Control** &mdash; Admin / User roles with guard-protected endpoints
- **Rate Limiting** &mdash; throttled API to prevent abuse
- **Image Upload** &mdash; multer-based with MIME validation and size limits

## Tech Stack

### Backend &mdash; `apps/api`

| Layer       | Technology                                                     |
| ----------- | -------------------------------------------------------------- |
| Framework   | **NestJS 11** with modular architecture                        |
| Language    | **TypeScript 5.9** (strict mode)                               |
| Database    | **MongoDB** via **Mongoose 8** with paginate plugin            |
| Auth        | **Passport.js** + **JWT** (access + refresh token rotation)    |
| Validation  | **class-validator** + **class-transformer** (DTO-based)        |
| Security    | **helmet**, **@nestjs/throttler**, **CORS**, **cookie-parser** |
| Email       | **Nodemailer** for account activation                          |
| File Upload | **Multer** with MIME whitelist                                 |
| Config      | **@nestjs/config** with **Joi** schema validation              |

### Frontend &mdash; `apps/web`

| Layer           | Technology                                          |
| --------------- | --------------------------------------------------- |
| Framework       | **Next.js 16** (App Router, Server Components, SSR) |
| Language        | **TypeScript 5.9**                                  |
| State           | **Redux Toolkit** (createSlice, createAsyncThunk)   |
| UI              | **Material UI 9**                                   |
| HTTP            | **Axios** with interceptors (auto token refresh)    |
| Infinite Scroll | **react-infinite-scroll-component**                 |

### Shared &mdash; `packages/shared`

Shared TypeScript types, DTOs, enums, and constants consumed by both apps &mdash; single source of truth for the API contract.

### Infrastructure

| Tool                                      | Purpose                                             |
| ----------------------------------------- | --------------------------------------------------- |
| **Turborepo**                             | Monorepo orchestration with caching                 |
| **pnpm**                                  | Fast, disk-efficient package manager                |
| **Docker Compose**                        | One-command local environment (API + Web + MongoDB) |
| **Vitest** + **@nestjs/testing**          | Unit testing with SWC compilation                   |
| **ESLint 9** (flat config) + **Prettier** | Code quality and formatting                         |
| **Husky** + **lint-staged**               | Pre-commit hooks                                    |

## Architecture

```
newsApp/
├── apps/
│   ├── api/                    # NestJS backend
│   │   └── src/
│   │       ├── common/         # Guards, filters, interceptors, decorators
│   │       ├── modules/
│   │       │   ├── auth/       # JWT auth, token rotation, Passport strategies
│   │       │   ├── users/      # User CRUD, password management
│   │       │   ├── news/       # News CRUD, search, pagination
│   │       │   ├── comments/   # Comment CRUD per news/user
│   │       │   ├── mail/       # Email activation service
│   │       │   └── external-news/  # Cybersport & Guardian API integrations
│   │       └── main.ts
│   │
│   └── web/                    # Next.js frontend
│       └── src/
│           ├── app/            # App Router pages (SSR + static)
│           ├── components/     # Reusable UI components
│           ├── store/slices/   # Redux Toolkit slices
│           ├── hooks/          # Typed dispatch & selector hooks
│           └── lib/            # Axios API client with interceptors
│
├── packages/
│   └── shared/                 # Shared types, DTOs, constants
│
├── docker-compose.yml
├── turbo.json
└── tsconfig.base.json
```

## Getting Started

### Prerequisites

- **Node.js** >= 22
- **pnpm** >= 10
- **MongoDB** (local or Atlas) &mdash; or just use Docker

### Quick Start with Docker

```bash
cp .env.example .env
# Edit .env with your values
docker compose up
```

App is live at `http://localhost:3000`, API at `http://localhost:5001`.

### Manual Setup

```bash
# Install dependencies
pnpm install

# Copy env file
cp .env.example .env

# Start both apps in dev mode
pnpm dev
```

### Environment Variables

See [`.env.example`](.env.example) for the full list. Key variables:

| Variable                                                  | Description                             |
| --------------------------------------------------------- | --------------------------------------- |
| `DB_URL`                                                  | MongoDB connection string               |
| `JWT_ACCESS_SECRET`                                       | Secret for access tokens                |
| `JWT_REFRESH_SECRET`                                      | Secret for refresh tokens               |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASSWORD` | Email server for activation             |
| `API_URL`                                                 | Backend URL (used in activation emails) |
| `FRONTEND_URL`                                            | Frontend URL (used in redirects)        |
| `GUARDIAN_API_KEY`                                        | The Guardian API key (optional)         |

## Scripts

Run from the repository root:

| Command           | Description                        |
| ----------------- | ---------------------------------- |
| `pnpm dev`        | Start all apps in development mode |
| `pnpm build`      | Build all apps for production      |
| `pnpm lint`       | Lint all packages                  |
| `pnpm test`       | Run all tests                      |
| `pnpm format`     | Format code with Prettier          |
| `pnpm type-check` | TypeScript type checking           |

## API Endpoints

### Auth &mdash; `/api/user`

| Method | Endpoint          | Auth   | Description                     |
| ------ | ----------------- | ------ | ------------------------------- |
| `POST` | `/register`       | -      | Register a new user             |
| `POST` | `/login`          | -      | Log in and receive tokens       |
| `POST` | `/logout`         | -      | Log out and clear cookies       |
| `GET`  | `/refresh`        | Cookie | Refresh access token            |
| `GET`  | `/activate/:link` | -      | Activate account via email link |

### Users &mdash; `/api/user`

| Method   | Endpoint               | Auth  | Description                |
| -------- | ---------------------- | ----- | -------------------------- |
| `GET`    | `/user-info/:id`       | -     | Get user by ID             |
| `GET`    | `/all-users`           | Admin | List all users (paginated) |
| `PUT`    | `/update-user/:id`     | User  | Update profile             |
| `PUT`    | `/update-password/:id` | User  | Change password            |
| `DELETE` | `/delete-user/:id`     | Admin | Delete user                |

### News &mdash; `/api/news`

| Method   | Endpoint                  | Auth  | Description                       |
| -------- | ------------------------- | ----- | --------------------------------- |
| `GET`    | `/get-all-news`           | -     | List news (paginated, filterable) |
| `GET`    | `/get-news-by-id/:id`     | -     | Get single article                |
| `GET`    | `/get-news-by-title`      | -     | Search by title                   |
| `GET`    | `/category`               | -     | Filter by category                |
| `POST`   | `/post-news`              | Admin | Create news with image            |
| `PUT`    | `/update-news/:id`        | Admin | Update news                       |
| `DELETE` | `/delete-news/:id`        | Admin | Delete news                       |
| `GET`    | `/update-from-cybersport` | Admin | Fetch from Cybersport API         |
| `GET`    | `/update-from-guardian`   | Admin | Fetch from Guardian API           |

### Comments &mdash; `/api/comment`

| Method   | Endpoint             | Auth | Description                         |
| -------- | -------------------- | ---- | ----------------------------------- |
| `POST`   | `/`                  | User | Create comment                      |
| `GET`    | `/:id`               | -    | Get comment                         |
| `PUT`    | `/:id`               | User | Update comment                      |
| `DELETE` | `/:id`               | User | Delete comment                      |
| `GET`    | `/news-comments/:id` | -    | Get all comments for a news article |
| `GET`    | `/user-comments/:id` | -    | Get all comments by a user          |

## Testing

```bash
# Run all tests
pnpm test

# Run with watch mode
pnpm --filter @newsapp/api test:watch

# Run with coverage
pnpm --filter @newsapp/api test:cov
```

**30 unit tests** covering all backend services:

| Suite             | Tests | Coverage                                 |
| ----------------- | ----- | ---------------------------------------- |
| `AuthService`     | 5     | login, register, refresh, logout         |
| `UsersService`    | 9     | CRUD, password hashing, validation       |
| `NewsService`     | 10    | CRUD, search (regex escape), bulk create |
| `CommentsService` | 6     | CRUD, filtering by news/user             |

## Security

- **bcrypt** with 12 salt rounds for password hashing
- **JWT** access tokens (1d) + refresh tokens (30d) in httpOnly cookies
- **Helmet** security headers
- **Rate limiting** via `@nestjs/throttler` (100 req/min)
- **Input validation** on every endpoint via class-validator DTOs
- **Regex escape** in search to prevent ReDoS
- **CORS** with explicit origin whitelist
- **Environment validation** &mdash; app won't start with missing config
- **No stack traces** in production error responses

---

<div align="center">

Built with modern TypeScript &bull; Designed for scalability &bull; Tested for reliability

</div>
