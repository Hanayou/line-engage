# LINE Engage — Customer Engagement SaaS Demo

A full-stack demo of a LINE Mini App customer engagement platform, built with the modern TypeScript stack.

## Architecture

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Next.js    │────▶│    Hono      │────▶│  PostgreSQL   │
│   Dashboard  │     │    API       │     │  (Cloud SQL)  │
│   + NextAuth │     │  /api/v1/*   │     │               │
│   Port 3000  │     │  Port 8787   │     │  Port 5432    │
└──────┬───────┘     └──────────────┘     └───────────────┘
       │
       │  LIFF SDK
       ▼
┌──────────────┐
│  LINE App    │
│  (Mini App)  │
│  End Users   │
└──────────────┘
```

### Tech Stack

| Layer          | Technology                              |
|----------------|-----------------------------------------|
| Frontend       | Next.js 14 (App Router), Tailwind CSS   |
| Backend        | Hono (standalone Node.js server)        |
| Auth           | NextAuth.js (Credentials provider)      |
| Database       | PostgreSQL 16, Drizzle ORM              |
| LINE SDK       | LIFF v2 + @line/liff-mock               |
| Infrastructure | Google Cloud (Cloud Run, Cloud SQL)      |
| IaC            | Terraform                               |
| CI/CD          | GitHub Actions                          |
| Monorepo       | Turborepo + pnpm workspaces             |

## Quick Start (Local)

### Prerequisites
- Node.js 20+
- pnpm 9+
- Docker (for PostgreSQL)

### 1. Clone and install

```bash
git clone https://github.com/your-name/line-engage-demo.git
cd line-engage-demo
pnpm install
```

### 2. Start PostgreSQL

```bash
docker compose up -d db
```

### 3. Set up environment

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

### 4. Run migrations and seed data

```bash
pnpm db:migrate
pnpm db:seed
```

### 5. Start development servers

```bash
pnpm dev
```

- **Web**: http://localhost:3000
- **API**: http://localhost:8787
- **Health**: http://localhost:8787/health

### Demo credentials
- Email: `admin@line-engage.dev`
- Password: `demo1234`

## Project Structure

```
line-engage-demo/
├── apps/
│   ├── web/              # Next.js 14 dashboard
│   │   ├── app/          # App Router pages
│   │   ├── components/   # React components
│   │   ├── lib/          # Auth config, API client
│   │   └── Dockerfile
│   └── api/              # Hono REST API
│       ├── src/
│       │   ├── routes/   # Route handlers
│       │   ├── middleware/# Logger, error handler, request ID
│       │   ├── db/       # Schema, migrations, seed
│       │   └── lib/      # Structured logger
│       └── Dockerfile
├── packages/
│   └── shared/           # Types, constants, validation (Zod)
├── infra/                # Terraform (Cloud Run, Cloud SQL, IAM)
├── .github/workflows/    # CI + CD pipelines
├── docker-compose.yml    # Local PostgreSQL
└── turbo.json            # Turborepo config
```

## Key Design Decisions

### Why separate Hono API vs Next.js API routes?
The API serves both the dashboard AND the LINE Mini App (LIFF). Independent deployment allows the API to scale separately from the frontend — critical for a SaaS serving potentially thousands of LINE Mini App users while the dashboard has a handful of brand managers.

### Why Drizzle ORM?
Type-safe schema definitions that generate TypeScript types, lightweight runtime (no query builder overhead), and first-class migration support. Fits the "modern TypeScript" philosophy of the stack.

### Why Cloud Run?
Zero-to-scale serverless is ideal for SaaS: no cost when idle, automatic scaling under load, no infrastructure management. Combined with Cloud SQL for managed PostgreSQL and VPC connectors for secure private networking.

### LIFF Integration Pattern
The demo uses `@line/liff-mock` for browser-based testing. The real integration follows the same pattern:
1. `liff.init({ liffId })` — authenticates with LINE
2. `liff.getProfile()` — retrieves user info
3. Send user ID to our API → link with customer record
4. Since Nov 2024, Unverified Mini Apps can be published without review

## API Endpoints

| Method | Path                     | Description                     |
|--------|--------------------------|---------------------------------|
| GET    | `/health`                | Service health check            |
| POST   | `/api/v1/auth/verify`    | Verify login credentials        |
| GET    | `/api/v1/dashboard/stats`| Aggregate engagement metrics    |
| GET    | `/api/v1/dashboard/trend`| 7-day engagement trend          |
| GET    | `/api/v1/customers`      | Paginated customer list         |
| GET    | `/api/v1/customers/:id`  | Single customer detail          |
| GET    | `/api/v1/activity`       | Recent activity feed            |

## Infrastructure (Terraform)

```bash
cd infra
terraform init
terraform plan -var-file=prod.tfvars
terraform apply -var-file=prod.tfvars
```

Resources provisioned:
- Cloud Run services (web + api) with auto-scaling
- Cloud SQL PostgreSQL 16 with automated backups
- VPC + connector for private Cloud SQL access
- Artifact Registry for Docker images
- Secret Manager for sensitive configuration
- IAM service accounts with least-privilege roles

## Observability

- **Structured JSON logging** — every request logged with method, path, status, duration, and request ID
- **Request ID propagation** — `X-Request-Id` header flows from web → API for trace correlation
- **Health check endpoint** — `/health` returns service status, version, and uptime
- **Cloud Run integration** — logs automatically stream to Cloud Logging; liveness/startup probes configured

## License

MIT
