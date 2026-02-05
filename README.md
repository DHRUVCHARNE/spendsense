<div align="center">
<img src="images/landing-page-dark-mode.png" alt="SpendSense Landing Page - Dark Mode" width="100%" />
</div>

# SpendSense 💰

> **Smart Personal Expense Tracker & Financial Insights Platform**

[![GitHub](https://img.shields.io/badge/GitHub-DHRUVCHARNE%2Fspendsense-blue?logo=github)](https://github.com/DHRUVCHARNE/spendsense)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-spendsense--sepia.vercel.app-success)](https://spendsense-sepia.vercel.app/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15%2B-black)](https://nextjs.org/)
[![License](https://img.shields.io/badge/License-MIT-green)](#license)

---

## 🎯 Overview

**SpendSense** is a production-ready, full-stack expense tracking application built with cutting-edge technologies. It empowers users to take control of their finances by providing intelligent expense tracking, real-time analytics, multi-currency support, and beautiful visual insights.

### Key Highlights

- ✅ **Type-Safe**: End-to-end TypeScript with tRPC
- 🔐 **Secure**: OAuth2 authentication, rate limiting, server-side validation
- 📊 **Intelligent**: Real-time analytics, spending patterns, category breakdowns
- 🌍 **Multi-Currency**: Support for 10+ currencies with automatic conversion
- ⚡ **Performance**: Cursor-based pagination, Redis caching, optimized queries
- 🎨 **Beautiful**: Dark/light mode, responsive design, modern UI components
- 🚀 **Scalable**: Cloud-ready with Vercel deployment

---

<div align="center">
<img src="images/landing-page-light-mode.png" alt="SpendSense Landing Page - Light Mode" width="100%" />
</div>

## 🎬 Feature Showcase

### 💳 Smart Transaction Management

- Create, read, update, and delete expense/income transactions
- Categorize transactions with custom categories (25 max per user)
- Support for 9 payment methods (UPI, Cash, Card, Net Banking, Wallet, Bank Transfer, Cheque, EMI, Other)
- Multi-currency support (INR, USD, EUR, GBP, AUD, CAD, NZD, SGD, HKD, JPY)
- Add descriptions and attach categories for better organization
- Maximum 700 transactions per user (quota-based system)

<div align="center">
<img src="images/txns-page.png" alt="Transactions Management Page" width="100%" />
</div>

### 📈 Advanced Analytics Dashboard

- **Summary Cards**: Income & expense totals by currency
- **Monthly Trends**: Line chart showing cumulative balance over time
- **Category Breakdown**: Pie chart visualizing expense distribution
- **Payment Methods**: Bar chart analyzing spending patterns
- **Net Worth Tracking**: Running balance calculation and visualization

<div align="center">
<img src="images/reports.png" alt="Analytics Dashboard" width="100%" />
</div>

### 🏷️ Category Management

- Create custom expense categories with custom colors
- Edit category names and color codes
- Delete categories (transactions remain orphaned for historical data)
- Color-coded categorization for visual organization

### 🔍 Powerful Filtering & Search

- Date range filtering (from/to dates)
- Transaction type filtering (Expense/Income)
- Payment method filtering
- Category-based filtering
- Full-text description search (case-insensitive)
- Persistent filter state

<div align="center">
<img src="images/add-txn.png" alt="Add Transaction Modal" width="100%" />
</div>

### 🏷️ Category Organization

<div align="center">
<img src="images/categories.png" alt="Category Management" width="100%" />
</div>

### 📄 Data Export

- Export transactions as JSON format
- Timestamped export filenames
- Bulk transaction download

---

## 🏗️ Architecture Overview

SpendSense follows a **Next.js-based full-stack monorepo architecture** with clear separation of concerns:

```
Client (Next.js App Router)
    ↓
Frontend Components (React + TailwindCSS + shadcn/ui)
    ↓
API Layer (tRPC + Next.js API Routes)
    ↓
Authentication (NextAuth.js with OAuth2)
    ↓
Business Logic (Drizzle ORM + Services)
    ↓
PostgreSQL Database
    ↓
Redis Cache (Upstash)
```

---

## 🛠️ Technology Stack

### Frontend Technologies

| Technology | Purpose | Version |
|-----------|---------|---------|
| **Next.js** | React framework with App Router | 15+ |
| **React** | UI library | 19+ |
| **TypeScript** | Type safety | 5.0+ |
| **tRPC** | Type-safe RPC | Latest |
| **TanStack Query** | Data fetching & caching | v5 |
| **Zustand** | State management | Latest |
| **shadcn/ui** | UI component library | Latest |
| **TailwindCSS** | Utility-first CSS | v4 |
| **Recharts** | Data visualization | Latest |
| **Zod** | Schema validation | Latest |

### Backend Technologies

| Technology | Purpose | Version |
|-----------|---------|---------|
| **Next.js** | Node.js framework | 15+ |
| **NextAuth.js** | OAuth2 authentication | v5 |
| **Drizzle ORM** | Type-safe database access | Latest |
| **PostgreSQL** | Primary database | 14+ |
| **Upstash Redis** | Rate limiting & caching | Latest |
| **Zod** | Schema validation | Latest |

### Infrastructure & DevOps

| Technology | Purpose |
|-----------|---------|
| **Vercel** | Hosting & deployment |
| **Docker** | Containerization |
| **Bun** | Fast JavaScript runtime |
| **ESLint** | Code linting |

---

## 📊 Database Schema

### Entity Relationship Diagram

```
┌─────────────────┐
│     Users       │
├─────��───────────┤
│ id (PK)         │──┬────┬────┬────┐
│ name            │  │    │    │    │
│ email (UNIQUE)  │  │    │    │    │
│ emailVerified   │  │    │    │    │
│ image           │  │    │    │    │
│ role            │  │    │    │    │
│ createdAt       │  │    │    │    │
│ updatedAt       │  │    │    │    │
└─────────────────┘  │    │    │    │
                     │    │    │    │
    ┌────────────────┘    │    │    │
    │                     │    │    │
┌────────────────────┐    │    │    │
│   Transactions     │    │    │    │
├────────────────────┤    │    │    │
│ id (PK)            │    │    │    │
│ userId (FK)        │◄───┘    │    │
│ categoryId (FK)    │◄───────┐│    │
│ txnType (ENUM)     │         ││    │
│ amountPaise (INT)  │         ││    │
│ currency (VARCHAR) │         ││    │
│ description        │         ││    │
│ paymentMethod      │         ││    │
│ createdAt          │         ││    │
│ updatedAt          │         ││    │
└────────────────────┘         ││    │
                              ││    │
                   ┌──────────┘│    │
                   │           │    │
                ┌──────────────┘    │
                │                   │
           ┌──────────────┐    ┌────────────────┐
           │ Categories   │    │  NextAuth      │
           ├──────────────┤    │   Tables       │
           │ id (PK)      │    ├────────────────┤
           │ userId (FK)  │◄───┤ Accounts       │
           │ name         │    │ Sessions       │
           │ color        │    │ Verification   │
           │ createdAt    │    │ Authenticators │
           │ updatedAt    │    └────────────────┘
           └──────────────┘
```

### Tables Overview

#### **Users Table** (`user`)

```sql
CREATE TABLE "user" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100),
  email VARCHAR(255) UNIQUE NOT NULL,
  emailVerified TIMESTAMP WITH TIMEZONE,
  image TEXT,
  role ENUM('ADMIN', 'USER') DEFAULT 'USER',
  createdAt TIMESTAMP WITH TIMEZONE DEFAULT now(),
  updatedAt TIMESTAMP WITH TIMEZONE DEFAULT now()
);
```

#### **Transactions Table** (`txn`)

```sql
CREATE TABLE "txn" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  txn_type ENUM('EXPENSE', 'INCOME') NOT NULL,
  category_id UUID REFERENCES "category"(id) ON DELETE SET NULL,
  amount_paise INTEGER NOT NULL CHECK (amount_paise > 0),
  currency VARCHAR(3) DEFAULT 'INR' NOT NULL,
  description VARCHAR(400),
  payment_method ENUM('UPI', 'CASH', 'CARD', 'NETBANKING', 'WALLET', 
                      'BANK_TRANSFER', 'CHEQUE', 'EMI', 'OTHER') DEFAULT 'OTHER',
  createdAt TIMESTAMP WITH TIMEZONE DEFAULT now(),
  updatedAt TIMESTAMP WITH TIMEZONE DEFAULT now()
);

-- Indexes for performance
CREATE INDEX "txn_user_created_at_idx" ON "txn"(user_id, created_at, id);
CREATE INDEX "txn_user_type_idx" ON "txn"(user_id, txn_type);
CREATE INDEX "txn_user_payment_idx" ON "txn"(user_id, payment_method);
CREATE INDEX "txn_user_category_idx" ON "txn"(user_id, category_id);
```

#### **Categories Table** (`category`)

```sql
CREATE TABLE "category" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  name VARCHAR(50) NOT NULL,
  color VARCHAR(20),
  createdAt TIMESTAMP WITH TIMEZONE DEFAULT now(),
  updatedAt TIMESTAMP WITH TIMEZONE DEFAULT now(),
  UNIQUE(user_id, name)
);

CREATE INDEX "category_user_idx" ON "category"(user_id);
```

#### **NextAuth Tables** (Adapter Tables)

- **accounts**: OAuth2 provider account linkage
- **sessions**: User session management
- **verificationTokens**: Email verification tokens
- **authenticators**: Passkey/WebAuthn support

---

## 🔐 Authentication & Authorization

### OAuth2 Providers

1. **GitHub** - Social sign-in via GitHub
2. **Google** - Social sign-in via Google

### Authentication Flow

- Uses **NextAuth.js v5** with `DrizzleAdapter`
- **Database session strategy** for persistent sessions
- OAuth providers configured in `auth.config.ts`
- Auth handlers exposed via `/api/auth/[...nextauth]` route

### Security Implementation

- Password-free authentication (OAuth2 only)
- Session-based authorization via middleware
- Protected procedures in tRPC with `authMiddleware`

**Auth Config** (`auth.config.ts`):
```typescript
providers: [Google, Github]
session: { strategy: "database" }
adapter: DrizzleAdapter(db)
```

---

## ⚡ Rate Limiting Strategy

SpendSense implements a **multi-layer rate limiting system** using **Upstash Redis** with sliding window algorithm:

### Rate Limit Configurations (per minute)

```typescript
limitsPerUser: {
  categories: 25,              // Max categories per user
  txns: 700,                   // Max transactions per user
  amount: 5000,                // Max single transaction amount
  loginAttempts: 10,           // Login attempts per minute
  createAttempts: 20,          // Create operations per minute
  updateAttempts: 10,          // Update operations per minute
  deleteAttempts: 10,          // Delete operations per minute
  fetchAttempts: 90            // Fetch/read operations per minute
}
```

### Rate Limiting Layers

1. **IP-Based Limiting** (`ipRateLimit` middleware):
   - Applied to all public endpoints
   - Pre-request check using IP address
   - 90 fetches per minute per IP

2. **User-Based Limiting** (`userRateLimit` middleware):
   - Applied to authenticated routes
   - Per-user per-minute limits
   - Enforced after authentication

3. **Authentication Endpoint Limiting** (`proxy.ts`):
   - Special rate limiting for sign-in endpoints
   - 10 attempts per minute per IP+cookie combination
   - Includes countdown feedback to users

4. **Server Actions Limiting** (`Guard` function):
   - Two-stage validation in server actions
   - Stage 1: IP-based pre-check (no DB required)
   - Stage 2: User authentication + per-user rate limiting
   - Graceful error handling with custom messages

### Rate Limit Implementation

```typescript
const createLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, "1m") // 20 per minute
});
```

---

## 📡 tRPC API Architecture

### Overall Structure

SpendSense uses **tRPC (Type-safe RPC)** as the primary data-fetching mechanism, providing end-to-end type safety from backend to frontend.

### Router Structure (`lib/trpc/routers/`)

```
appRouter
├── txn (Transaction Router)
│   ├── list (paginated transactions with cursor)
│   ├── getById (single transaction)
│   ├── summary (income/expense summary by currency)
│   ├── monthlyStats (monthly trends)
│   ├── categoryBreakdown (expenses by category)
│   ├── reportDashboard (comprehensive report data)
│   └── search (full-text description search)
└── category (Category Router)
    ├── list (paginated categories)
    ├── getMany (get multiple by IDs)
```

### Procedure Types

**1. Public Procedure** (with IP rate limiting):
```typescript
rateLimitedProcedure = publicProcedure.use(ipRateLimit)
```

**2. Protected Procedure** (with auth + rate limiting):
```typescript
protectedProcedure = rateLimitedProcedure
  .use(authMiddleware)
  .use(userRateLimit)
```

### API Endpoints

**Primary endpoint**: `/api/trpc/[trpc]` (dynamic routing)

**HTTP Methods**: `GET` and `POST` (batch requests supported)

**Response Format**: SuperJSON serialization for complex types (Date, Map, Set, etc.)

### tRPC Client Setup

```typescript
// Frontend client
api.createClient({
  links: [httpBatchLink({ 
    transformer: superjson,
    url: '/api/trpc'
  })]
})
```

---

## 📱 Core Features

### 1. Transaction Management

- **Create**: Add expenses/income with categories, payment methods, currency
- **Read**: Paginated list with cursor-based pagination
- **Update**: Modify existing transactions
- **Delete**: Remove transactions
- **Limits**: Max 700 transactions per user

### 2. Category Management

- **Create**: Custom expense categories with colors
- **Update**: Modify category names and colors
- **Delete**: Remove categories (transactions remain but orphaned)
- **Limits**: Max 25 categories per user

### 3. Real-time Analytics

- **Summary Cards**: Total income/expense by currency
- **Monthly Trends**: Line chart showing cumulative balance over time
- **Category Breakdown**: Pie chart showing expense distribution
- **Payment Methods**: Bar chart showing spending by payment method
- **Net Worth Tracking**: Running balance calculation

### 4. Advanced Filtering

- Date range filtering (from/to dates)
- Transaction type filtering (EXPENSE/INCOME)
- Payment method filtering
- Category filtering
- Description search (full-text ilike query)
- Currency selection

### 5. Pagination

- **Cursor-based pagination** for efficient large datasets
- Supports bidirectional navigation (next/prev)
- Configurable page size (5-20 items)
- Maintains sort order and filters

### 6. Multi-Currency Support

- Support for multiple currencies per user
- INR as default
- Popular currencies: USD, EUR, GBP, AUD, CAD, NZD, SGD, HKD, JPY, INR

### 7. Data Export

- Export transactions as JSON
- Timestamped download filenames

---

## 🎨 Frontend Architecture

### Components Structure

**Layout Components**:
- `Header.tsx` - Navigation with auth button, theme toggle
- `Footer.tsx` - Social links and copyright
- `LandingPage.tsx` - Public landing page with features showcase

**Transaction Management**:
- `txn-table/` - Transaction CRUD operations
  - `create-txn.tsx` - Add transaction form dialog
  - `update-txn.tsx` - Edit transaction form
  - `delete-txn.tsx` - Delete confirmation dialog
  - `columns.tsx` - Table column definitions
  - `txn-table.tsx` - Main table component

**Filtering & Pagination**:
- `txn-date-range-filter.tsx` - Date picker
- `txn-limit-filter.tsx` - Row count selector
- `popular-currencies.ts` - Currency selection

**Reporting/Analytics**:
- `reports/` - Dashboard components
  - `reports-dashboard-client.tsx` - Main dashboard
  - `txn-monthly-chart.tsx` - Monthly trends line chart
  - `txn-category-pie.tsx` - Category breakdown pie chart
  - `txn-payment-bar.tsx` - Payment method bar chart
  - `report-networth-line.tsx` - Net worth tracking
  - `txn-summary-cards.tsx` - Summary statistics

**Category Management**:
- `category-table/` - Category CRUD
  - `create-cat.tsx` - Add category
  - `update-cat.tsx` - Edit category
  - `delete-cat.tsx` - Delete category

**Auth Components**:
- `auth/` - Authentication UI
  - `sign-in.tsx` - Sign in form
  - `auth-button.tsx` - Auth state button

### State Management

**Zustand Store** (`app/store/categories-store.ts`):
```typescript
useCategoryStore {
  categories: Record<string, CategoryMeta>
  categoriesArr: CategoryMeta[]
  hydrate(cats) - Initialize from server
  remove(id) - Delete category
  upsert(cat) - Add/update category
  clear() - Reset store
}
```

**Query Caching**:
- TanStack React Query with 30s stale time
- SuperJSON serialization/deserialization
- Automatic refetching on window focus

---

## 🔧 Server Actions & Form Handling

### Server Actions (`app/actions/`)

**Transaction Actions**:
```typescript
createTxnAction - Create expense/income
updateTxnAction - Modify transaction
deleteTxnAction - Remove transaction
```

**Category Actions**:
```typescript
createCategoryAction - Create custom category
updateCategoryAction - Modify category
deleteCategoryAction - Remove category
```

**User Actions**:
```typescript
deleteUserAction - Account deletion
```

### Action Helper (`action-helper.ts`)

- `handleAction()` - Generic server action wrapper
  - FormData parsing
  - Zod schema validation
  - Error handling
  - Cache revalidation
- `Guard()` - Authentication + rate limiting wrapper
  - IP-based pre-check
  - Optional authentication
  - Per-user rate limiting
  - Overloaded signatures for type safety

### Validation Schema (`lib/db/zod-schema.ts`)

- Auto-generated from Drizzle schema via `drizzle-zod`
- Custom validation rules (amount limits, category limits)
- Nested object validation

---

## 📋 Key Configuration Files

### Environment Variables (`.env.example`)

```env
# NextAuth
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# OAuth Providers
AUTH_GITHUB_ID=your_github_oauth_id
AUTH_GITHUB_SECRET=your_github_oauth_secret
AUTH_GOOGLE_ID=your_google_oauth_id
AUTH_GOOGLE_SECRET=your_google_oauth_secret

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/spendsense

# Redis (Upstash)
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_token

# Deployment (optional)
VERCEL_URL=your_vercel_url
LOCAL_URL=http://localhost:3000
```

### Database Config (`drizzle.config.ts`)

```typescript
dialect: "postgresql"
schema: "./lib/db/schema.ts"
out: "./migrations"
```

### Docker Compose (`docker-compose.yml`)

- PostgreSQL service
- Volume persistence
- Environment configuration

---

## 🚀 API Routes

### Authentication Routes

- `GET/POST /api/auth/signin` - Sign in endpoint
- `GET/POST /api/auth/callback/:provider` - OAuth callback
- `GET/POST /api/auth/session` - Get current session
- `POST /api/auth/signout` - Sign out

### tRPC Routes

- `GET/POST /api/trpc/[...trpc]` - Dynamic tRPC routes
  - Batch request support
  - Automatic type inference

### NextAuth Routes (via handlers)

- Full NextAuth v5 route handling

---

## 💾 Database Migrations

Drizzle ORM manages schema migrations with:
- SQL migration files in `/migrations`
- Version control for schema changes
- Type-safe schema definitions

---

## 🎯 User Limits & Quotas

Per-user resource limits enforce fair usage:

| Resource | Limit | Purpose |
|----------|-------|---------|
| Categories | 25 | Organize expenses |
| Transactions | 700 | Track expenses |
| Transaction Amount | ₹5,000 | Prevent data entry errors |
| Create Operations | 20/min | Rate limit mutations |
| Update Operations | 10/min | Rate limit mutations |
| Delete Operations | 10/min | Rate limit mutations |
| Fetch Operations | 90/min | Rate limit queries |
| Login Attempts | 10/min | Prevent brute force |

---

## 🔄 Data Flow Example: Creating a Transaction

```
1. User fills form → React component state
   ↓
2. Form submission → createTxnAction (server action)
   ↓
3. Guard() checks: IP rate limit + Auth + User rate limit
   ↓
4. Zod validation against txnInsertSchema
   ↓
5. Check user transaction count vs. 700 limit
   ↓
6. Insert into PostgreSQL via Drizzle ORM
   ↓
7. Revalidate cache ("/")
   ↓
8. Return result to client
   ↓
9. Toast notification (success/error)
   ↓
10. UI updates via TanStack Query re-fetch
```

---

## 📚 Key Libraries & Their Roles

| Library | Purpose |
|---------|---------|
| `next-auth` | OAuth2 authentication |
| `drizzle-orm` | Type-safe SQL ORM |
| `@trpc/server` | Backend RPC framework |
| `@trpc/react-query` | Frontend RPC client |
| `@tanstack/react-query` | Async state management |
| `zustand` | Client state management |
| `zod` | Schema validation |
| `@upstash/ratelimit` | Rate limiting with Redis |
| `@upstash/redis` | Redis client |
| `shadcn/ui` | Pre-built UI components |
| `tailwindcss` | Utility CSS framework |
| `recharts` | Charts and visualizations |
| `sonner` | Toast notifications |
| `superjson` | Complex type serialization |

---

## 🎓 Code Quality & Best Practices

1. **Type Safety**: Full TypeScript with strict mode
2. **Validation**: Zod schemas for all inputs
3. **Error Handling**: Custom `AppError` classes with specific codes
4. **Rate Limiting**: Multi-layer protection (IP + User + Auth)
5. **Security**: Server-only modules (`"use server"`), middleware validation
6. **Performance**: Cursor-based pagination, query caching, index optimization
7. **Code Organization**: Clear separation between routers, actions, schemas, and components
8. **Testing**: ESLint configuration for code consistency

---

## 📦 Project Structure

```
spendsense/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Home page (landing/dashboard)
│   ├── layout.tsx                # Root layout with providers
│   ├── api/
│   │   ├── auth/                 # NextAuth routes
│   │   │   └── [...nextauth]/route.ts
│   │   └── trpc/                 # tRPC API route
│   │       └── [trpc]/route.ts
│   ├── actions/                  # Server actions
│   │   ├── txn.actions.ts        # Transaction mutations
│   │   ├── category.actions.ts   # Category mutations
│   │   ├── user.actions.ts       # User mutations
│   │   └── action-helper.ts      # Helper utilities
│   └── store/                    # Client state
│       └── categories-store.ts   # Zustand store
│
├── components/                   # React components
│   ├── Header.tsx                # Navigation header
│   ├── Footer.tsx                # Footer
│   ├── LandingPage.tsx           # Public landing page
│   ├── config.ts                 # App configuration
│   ├── auth/                     # Auth components
│   │   ├── sign-in.tsx
│   │   └── auth-button.tsx
│   ├── txn-table/                # Transaction components
│   │   ├── txn-table.tsx
│   │   ├── create-txn.tsx
│   │   ├── update-txn.tsx
│   │   ├── delete-txn.tsx
│   │   ├── columns.tsx
│   │   └── filters/
│   ├── category-table/           # Category components
│   │   ├── cat-table.tsx
│   │   ├── create-cat.tsx
│   │   ├── update-cat.tsx
│   │   └── delete-cat.tsx
│   ├── reports/                  # Analytics components
│   │   ├── reports-dashboard-client.tsx
│   │   ├── txn-monthly-chart.tsx
│   │   ├── txn-category-pie.tsx
│   │   ├── report-networth-line.tsx
│   │   └── txn-summary-cards.tsx
│   └── ui/                       # shadcn/ui components
│       ├── button.tsx
│       ├── dialog.tsx
│       ├── select.tsx
│       └── ...
│
├── lib/                          # Utility & core logic
│   ├── db/                       # Database layer
│   │   ├── index.ts              # Database client
│   │   ├── schema.ts             # Drizzle schema
│   │   ├── relations.ts          # Entity relations
│   │   └── zod-schema.ts         # Zod validation
│   ├── trpc/                     # tRPC configuration
│   │   ├── init.ts               # tRPC initialization
│   │   ├── client.ts             # Frontend client
│   │   ├── server.ts             # Server caller
│   │   ├── provider.tsx          # TRPCProvider
│   │   ├── procedures.ts         # Custom procedures
│   │   ├── middleware/           # Custom middleware
│   │   │   ├── auth-middleware.ts
│   │   │   └── rate-limit-middleware.ts
│   │   └── routers/              # API routers
│   │       ├── _app.ts           # Main router
│   │       ├── txn.router.ts     # Transaction queries
│   │       └── category.router.ts # Category queries
│   ├── rate-limit/               # Rate limiting
│   │   ├── rate-limit.ts         # Limiters
│   │   └── redis.ts              # Redis client
│   ├── txn-service/              # Transaction utilities
│   │   ├── txn.service.ts
│   │   └── txn.pagination.schema.ts
│   ├── category-service/         # Category utilities
│   │   ├── category.service.ts
│   │   └── category.pagination.schema.ts
│   ├── AppError.ts               # Custom error classes
│   └── formDataUtils.ts          # Form utilities
│
├── auth.ts                       # NextAuth configuration
├── auth.config.ts                # OAuth providers
├── proxy.ts                      # Middleware
├── middleware.ts                 # Next.js middleware (if exists)
│
├── migrations/                   # Database migrations
├── public/                       # Static assets
├── scripts/                      # Build scripts
│
├── package.json
├── tsconfig.json
├── next.config.ts
├── drizzle.config.ts
├── docker-compose.yml
└── .env.example
```

---

## 🔄 API Documentation

### tRPC Router Structure

#### **Transaction Router** (`api.txn`)

```typescript
// Queries
api.txn.list.useQuery(input)           // Paginated transactions
api.txn.getById.useQuery({ id })       // Single transaction
api.txn.summary.useQuery(options)      // Income/expense summary
api.txn.monthlyStats.useQuery()        // Monthly trends
api.txn.categoryBreakdown.useQuery()   // Expense by category
api.txn.reportDashboard.useQuery()     // Full dashboard data
api.txn.search.useQuery({ q })         // Description search
```

#### **Category Router** (`api.category`)

```typescript
// Queries
api.category.list.useQuery(input)      // Paginated categories
api.category.getMany.useQuery(ids)     // Multiple categories
```

### Server Actions

```typescript
// Transactions
await createTxnAction(formData)
await updateTxnAction(formData)
await deleteTxnAction(formData)

// Categories
await createCategoryAction(formData)
await updateCategoryAction(formData)
await deleteCategoryAction(formData)

// Users
await deleteUserAction(formData)
```

---

## 📊 Sample API Response

### Transaction List

```json
{
  "items": [
    {
      "id": "uuid",
      "userId": "uuid",
      "txnType": "EXPENSE",
      "categoryId": "uuid",
      "amountPaise": 50000,
      "currency": "INR",
      "description": "Grocery shopping",
      "paymentMethod": "UPI",
      "createdAt": "2026-02-05T10:30:00Z",
      "updatedAt": "2026-02-05T10:30:00Z"
    }
  ],
  "nextCursor": {
    "createdAt": "2026-02-05T10:30:00Z",
    "id": "uuid",
    "direction": "next"
  },
  "prevCursor": null,
  "hasMore": true
}
```

### Summary Response

```json
{
  "summary": {
    "income": 50000,
    "expense": 30000
  },
  "trend": [
    { "date": "2026-02-05", "income": 0, "expenses": 30000, "balance": -30000 }
  ],
  "categories": [
    { "name": "Food", "value": 25000, "fill": "#ef4444" }
  ],
  "payments": [
    { "method": "UPI", "total": 30000 }
  ]
}
```

---

## 🎨 UI/UX Features

### Design System

- **Color Scheme**: Dark-first with light mode support
- **Typography**: Clear hierarchy with accessible font sizes
- **Spacing**: Consistent spacing scale (4px base)
- **Components**: 20+ pre-built shadcn/ui components

### Key UI Components

#### Landing Page

- Hero section with CTA buttons
- Feature highlights (3 main features)
- Social proof section
- Call-to-action buttons
- Responsive grid layout

#### Dashboard

- Transaction management table
  - Sortable columns (date, amount, category, payment method)
  - Inline actions (edit, delete)
  - Pagination controls
  - Export functionality
- Analytics charts
  - Monthly trend line chart
  - Category pie chart
  - Payment method bar chart
  - Net worth line chart
- Summary cards
  - Total income
  - Total expense
  - Net balance

#### Forms & Dialogs

- Add/Edit transaction modal
- Add/Edit category modal
- Delete confirmation dialogs
- Field validation with error messages

### Responsive Design

- Mobile-first approach
- Breakpoints: sm, md, lg, xl, 2xl
- Touch-friendly button sizes (min 44px)
- Collapsible navigation on mobile

---

## 🧪 Development Workflow

### Available Scripts

```bash
# Development
bun run dev                    # Start dev server

# Database
bun run db:push              # Push schema to DB
bun run db:migrate           # Run migrations
bun run db:studio            # Open Drizzle Studio

# Building
bun run build                # Build for production
bun start                    # Start production server

# Linting
bun run lint                 # Run ESLint
```

### Code Organization

#### Server vs Client Code

- **Server Components** (default): Database queries, auth checks
- **Client Components**: (`"use client"`) Interactivity, state
- **Server Actions** (`"use server"`): Form submissions, mutations

#### Type Safety

- **Schema Validation**: Zod schemas for all inputs
- **Database Types**: Auto-generated from Drizzle schema
- **API Types**: Inferred from tRPC routers
- **Component Props**: Strict TypeScript interfaces

#### Error Handling

```typescript
try {
  const session = await auth()
  if (!session?.user?.id) throw new UnauthorizedError()
  // ... operation
} catch (err) {
  if (err instanceof AppError) {
    return { ok: false, message: err.message }
  }
}
```

---

## 📈 Performance Optimization

### Database

- **Indexes**: On userId, createdAt, txnType, paymentMethod, categoryId
- **Query Optimization**: Only fetch required fields
- **Connection Pooling**: Max 5 connections per instance

### Frontend

- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: Next.js Image component
- **CSS**: Tailwind's tree-shaking
- **Caching**: 30-second stale time for queries

### Rate Limiting

- **Sliding Window Algorithm**: Smooth rate enforcement
- **IP-based Pre-check**: No DB lookup for initial check
- **User-based Limiting**: Per-user per-minute quotas

---

## 🔄 Authentication Flow

```
User visits app
    ↓
Checks session (auth())
    ↓
No session? → Show Landing Page
    ↓
User clicks "Sign In"
    ↓
Redirects to /api/auth/signin
    ↓
OAuth Provider Selection (GitHub/Google)
    ↓
User authenticates with provider
    ↓
Provider callback → /api/auth/callback/[provider]
    ↓
Create user in DB (if new)
    ↓
Create session
    ↓
Redirect to dashboard
    ↓
Show authenticated UI
```

---

## 📱 Deployment

### Vercel Deployment

1. **Push to GitHub**

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Connect to Vercel**

- Visit https://vercel.com/import
- Select repository
- Set environment variables

3. **Configure environment variables** in Vercel:

```
NEXTAUTH_SECRET
NEXTAUTH_URL
AUTH_GITHUB_ID & SECRET
AUTH_GOOGLE_ID & SECRET
DATABASE_URL
UPSTASH_REDIS_REST_URL & TOKEN
```

4. **Deploy**

```bash
# Automatic on push to main
# Or manual from Vercel dashboard
```

### Local Docker for DB

# Run container
```
docker run -p 3000:3000 \
  -e DATABASE_URL=postgresql://... \
  -e UPSTASH_REDIS_REST_URL=... \
  spendsense
```

---

## **Fork the repository**

```bash
git clone https://github.com/YOUR_USERNAME/spendsense.git
cd spendsense
```

## 🐛 Troubleshooting

### Database Connection Issues

```bash
# Check DATABASE_URL
echo $DATABASE_URL

# Verify PostgreSQL is running
psql -U postgres -h localhost -d spendsense
```

### Redis Connection Issues

```bash
# Check Upstash credentials
echo $UPSTASH_REDIS_REST_URL

# Test Redis connection
curl $UPSTASH_REDIS_REST_URL/ping
```

### OAuth Setup Issues

- Ensure redirect URI matches `NEXTAUTH_URL`
- Check OAuth credentials are correct
- Verify provider apps are active

### Build Errors

```bash
# Clear cache and reinstall
rm -rf .next node_modules
bun install
bun run build
```

---

## 📚 Documentation References

- [Next.js Documentation](https://nextjs.org/docs)
- [tRPC Documentation](https://trpc.io)
- [Drizzle ORM](https://orm.drizzle.team)
- [NextAuth.js](https://next-auth.js.org)
- [TailwindCSS](https://tailwindcss.com)
- [TypeScript](https://www.typescriptlang.org/docs/)

---

## 👨‍💻 Author

**Dhruv Charne**

- GitHub: [@DHRUVCHARNE](https://github.com/DHRUVCHARNE)
- Twitter/X: [@Dhruv4ne](https://x.com/Dhruv4ne)
- LinkedIn: [Dhruv Charne](https://www.linkedin.com/in/dhruv-charne-908848213/)
- Portfolio: [dhruv4ne-portfolio.vercel.app](https://dhruv4ne-portfolio.vercel.app/)

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

You are free to:
- ✅ Use commercially
- ✅ Modify the code
- ✅ Distribute the software
- ✅ Use privately

---

## 🙏 Acknowledgments

- [Vercel](https://vercel.com) - Hosting platform
- [Next.js](https://nextjs.org) - React framework
- [Shadcn/ui](https://ui.shadcn.com) - UI components
- [Drizzle Team](https://orm.drizzle.team) - ORM library
- [tRPC](https://trpc.io) - Type-safe RPC
- Open source community

---

## 📊 Statistics

- **Lines of Code**: ~5,000+
- **Components**: 20+
- **API Endpoints**: 10+
- **Database Tables**: 5+ (including NextAuth)
- **Build Time**: ~2 minutes
- **Lighthouse Score**: 95+
---
<div align="center">
<img src="images/google-lighthouse.png" alt="Lighthouse score width="100%" />
</div>
---

## 🔗 Quick Links

| Link | URL |
|------|-----|
| Live Demo | https://spendsense-sepia.vercel.app/ |
| GitHub Repo | https://github.com/DHRUVCHARNE/spendsense |
| Issue Tracker | https://github.com/DHRUVCHARNE/spendsense/issues |
| Discussions | https://github.com/DHRUVCHARNE/spendsense/discussions |

---

<div align="center">

### ⭐ Found this helpful? Give it a star!

**[SpendSense](https://github.com/DHRUVCHARNE/spendsense)** - Take control of your money 💰

Made with ❤️ by [Dhruv Charne](https://github.com/DHRUVCHARNE)

</div>
