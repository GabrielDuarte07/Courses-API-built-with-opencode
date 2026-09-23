# API Courses

A REST API for managing **users** and **courses**, including enrollment and unenrollment between them. Built with **Fastify 5**, **TypeScript**, **Prisma 7** (SQLite) and **Zod 4** validation, with **automatically generated Swagger/OpenAPI documentation**.

## Features

- **User management** — create, list, retrieve, update and delete users.
- **Course management** — create, list, retrieve, update and delete courses.
- **Enrollment** — enroll users in courses, unenroll them, list a user's courses and a course's users.
- **Zod-validated schemas** — every request/response is validated and typed end-to-end through the Fastify Zod type provider.
- **Automatic OpenAPI documentation** — the Swagger UI and the raw spec are generated from the route schemas, so they never drift from the code.
- **Secure by default** — `helmet` security headers, configurable CORS, and passwords hashed with `bcryptjs` (never exposed from queries: the Prisma client omits the `password` column).
- **Error handling** — domain errors (`NotFound`, `Conflict`) mapped to clean `404`/`409` JSON responses; the SQLite unique constraint surfaces as `409 Email already in use`.
- **Prisma 7 migrations** — versioned SQL migrations tracked in `prisma/migrations`.

## Tech stack

| Layer            | Technology                                      |
| ---------------- | ----------------------------------------------- |
| Runtime          | Node.js (ESM, `type: "module"`)                 |
| Language         | TypeScript (strict mode)                        |
| Web framework    | Fastify 5                                       |
| Validation       | Zod 4 + `@fastify/type-provider-zod`            |
| ORM / database   | Prisma 7 + SQLite (`better-sqlite3` adapter)    |
| Documentation    | `@fastify/swagger` + `@fastify/swagger-ui`      |
| Security         | `@fastify/helmet`, `@fastify/cors`              |
| Password hashing | `bcryptjs`                                      |

## Architecture

The API follows a **layered architecture**, with each module (`user`, `course`) split into focused files:

```
src/
├── server.ts                 # Fastify bootstrap, plugins, graceful shutdown
├── prisma-client.ts          # Shared Prisma client (SQLite adapter + omit.password)
├── generated/prisma/         # Type-safe Prisma client (generated, gitignored)
├── course/
│   ├── course.routes.ts      # HTTP routes + OpenAPI schema metadata
│   ├── course.controller.ts  # Request <-> service adaptation, HTTP status/errors
│   ├── course.services.ts    # Business rules (date-range validation, existence checks)
│   ├── course.repository.ts  # Prisma data access
│   └── course.interfaces.ts  # Zod schemas + inferred types
└── user/
    ├── user.routes.ts
    ├── user.controller.ts
    ├── user.services.ts      # Password hashing, enrollment domain rules
    ├── user.repository.ts
    └── user.interfaces.ts
```

Request flow: **Route** → **Controller** → **Service** → **Repository** → **Prisma/SQLite**, and back with a serialized response. Controllers stay thin, services hold the business rules, and repositories are the only layer that touches Prisma.

### Data model

```prisma
model User {
  id          String       @id @default(uuid())
  name        String
  email       String       @unique
  password    String
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
  userCourses UserCourse[]
}

model Course {
  id          String       @id @default(uuid())
  name        String
  description String?
  startDate   DateTime
  endDate     DateTime
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
  userCourses UserCourse[]
}

model UserCourse {
  id         String   @id @default(uuid())
  userId     String
  courseId   String
  enrolledAt DateTime @default(now())
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  course     Course   @relation(fields: [courseId], references: [id], onDelete: Cascade)

  @@unique([userId, courseId])
  @@index([courseId])
}
```

`UserCourse` is a join table with a **unique constraint** on `(userId, courseId)`, so a user can only be enrolled once per course; a 409 is returned on duplicate enrollment attempts.

## API routes

The API exposes **14 endpoints**:

### Users (`/users`)

| Method | Route                    | Description                               |
| ------ | ------------------------ | ----------------------------------------- |
| POST   | `/users`                 | Create a user                             |
| GET    | `/users`                 | List all users                            |
| GET    | `/users/:id`             | Get a user by ID                          |
| PATCH  | `/users/:id`             | Update a user                             |
| DELETE | `/users/:id`             | Delete a user                             |
| GET    | `/users/:id/courses`     | List the courses a user is enrolled in    |
| POST   | `/users/:id/courses`     | Enroll a user in a course                 |
| DELETE | `/users/:id/courses/:courseId` | Unenroll a user from a course      |

### Courses (`/courses`)

| Method | Route             | Description                   |
| ------ | ----------------- | ----------------------------- |
| POST   | `/courses`        | Create a course               |
| GET    | `/courses`        | List all courses              |
| GET    | `/courses/:id`    | Get a course by ID            |
| PATCH  | `/courses/:id`    | Update a course               |
| DELETE | `/courses/:id`    | Delete a course               |
| GET    | `/courses/:id/users` | List the users enrolled in a course |

IDs are UUIDs. Dates are passed as ISO-8601 strings (`z.coerce.date()`) and returned as ISO-8601 strings. The course end date must be after the start date (validated with a Zod refinement).

### Example

```bash
# Create a user
curl -X POST http://localhost:3000/users \
  -H 'Content-Type: application/json' \
  -d '{"name":"Ada Lovelace","email":"ada@example.com","password":"supersecret"}'

# Create a course
curl -X POST http://localhost:3000/courses \
  -H 'Content-Type: application/json' \
  -d '{"name":"TypeScript Fundamentals","description":"Strict types, zero regrets","startDate":"2026-10-01","endDate":"2026-12-01"}'

# Enroll the user in the course
curl -X POST http://localhost:3000/users/<user-id>/courses \
  -H 'Content-Type: application/json' \
  -d '{"courseId":"<course-id>"}'
```

## API documentation (Swagger)

Run the server, then open:

- **Interactive Swagger UI** → `http://localhost:3000/documentation`
- **Raw OpenAPI JSON** → `http://localhost:3000/documentation/json`

The spec is OpenAPI 3.0.3 and is generated **from the route schemas** by `@fastify/swagger` (via the `jsonSchemaTransform` from `@fastify/type-provider-zod`), then served by `@fastify/swagger-ui`. Routes are grouped under the `users` and `courses` tags, and every operation includes its params, request body, responses and per-status descriptions (set with Zod's `.describe()`).

> `@fastify/swagger` must be registered **before** the route plugins so that all routes are picked up — the server does this in `src/server.ts`.

## Getting started

### Prerequisites

- Node.js 20+ (Prisma 7 requirement)
- npm

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
#    Create a .env file with the DATABASE_URL (see the table below).
#    The default `file:./dev.db` works out of the box.

# 3. Apply migrations and generate the Prisma client
npx prisma migrate dev

# 4. Run in development (hot reload)
npm run dev
```

The server listens on `http://localhost:3000` by default (`HOST` / `PORT` env vars override it).

### Environment variables

| Variable      | Default             | Description                                  |
| ------------- | ------------------- | -------------------------------------------- |
| `DATABASE_URL` | `file:./dev.db`    | SQLite database connection string             |
| `PORT`        | `3000`              | Server port                                   |
| `HOST`        | `0.0.0.0`           | Bind address                                  |
| `CORS_ORIGIN` | reflects origin     | Comma-separated allowed origins (`*`-safe)    |

### Scripts

| Command              | Description                                      |
| -------------------- | ------------------------------------------------ |
| `npm run dev`        | Start dev server with hot reload (`tsx watch`)   |
| `npm run build`      | Compile TypeScript to `dist/`                    |
| `npm start`          | Run the compiled server (`node dist/server.js`)  |
| `npx prisma migrate dev` | Apply migrations and regenerate the client  |
| `npx prisma studio`  | Open the Prisma Studio data browser              |

## How it was developed

The project was built incrementally, guided by the rules in `AGENTS.md`:

1. **Project skeleton** — a blank Fastify 5 app with the Zod type provider, ESM/NodeNext TypeScript, and the `@fastify/swagger` foundation already wired in as peer dependencies of `@fastify/type-provider-zod`.
2. **Data model first** — the SQLite schema (`User`, `Course`, `UserCourse`) was designed in `prisma/schema.prisma`, then rolled out through three versioned Prisma migrations (create user → create course → add the many-to-many join table with cascade deletes and a unique enrollment constraint).
3. **Layered modules** — each entity (`user`, `course`) was implemented as an isolated module following the rules for entity creation: kebab-case file names (`user.routes.ts`, not `userRoutes.ts`), classic `function` syntax, named imports, and TypeScript inferred types where possible.
4. **Validation-driven contracts** — Zod schemas in each module's `*.interfaces.ts` are the single source of truth: they validate input, type the handlers, and drive the OpenAPI documentation.
5. **Security defaults** — helmet for security headers, configurable CORS, `bcryptjs` hashing (10 salt rounds) and a Prisma client configured to omit the `password` column from every query result.
6. **Automatic documentation** — `@fastify/swagger` and `@fastify/swagger-ui` were registered before the routes with OpenAPI 3.0.3 metadata (info, servers, tags), and every route was annotated with `tags`, `summary`, `description` and response descriptions via `.describe()` (which returns a new Zod schema, keeping the serializer compiler happy).
7. **Verification** — `npm run build` type-checks the whole project; the spec at `/documentation/json` was verified to list all 14 routes, and the routes were smoke-tested live against SQLite (create/list/404 flows).

## License

UNLICENSED — private project.