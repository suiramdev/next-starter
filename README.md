> [!IMPORTANT]
> This project is currently under active development.

# Next.js Starter Kit

Welcome to the Next.js Starter Kit—a comprehensive, production-ready monorepo template designed to accelerate the development of modern web applications. This template integrates essential features such as authentication, database management, and a complete design system, enabling you to focus on building your unique business logic.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
   - [Environment Variables](#environment-variables)
   - [Database Setup](#database-setup)
   - [Running the Application](#running-the-application)
5. [Project Structure](#project-structure)
6. [Available Scripts](#available-scripts)
7. [Contributing](#contributing)
8. [License](#license)

## Project Overview

The Next.js Starter Kit is crafted to provide developers with a solid foundation for building scalable and maintainable web applications. By leveraging modern technologies and best practices in a monorepo architecture, this template reduces the time and effort required to launch your product.

## Features

- **Authentication**: Complete auth system with Better Auth supporting email/password authentication, session management, and middleware-based route protection
- **Monorepo Architecture**: Turborepo-powered workspace with shared packages and optimized build caching
- **Multiple Applications**: Web app, admin dashboard, documentation site, and Storybook component library
- **Database Integration**: PostgreSQL with Prisma ORM and Kysely query builder for type-safe database operations
- **UI Components**: Comprehensive component library built with shadcn/ui
- **Modern Styling**: Tailwind CSS v4 with modern design tokens and theming support
- **Type Safety**: Full TypeScript support across all packages with shared configurations
- **Development Tools**: Biome for linting/formatting, Turbopack for fast development builds
- **Documentation**: Nextra-powered documentation site with MDX support

## Tech Stack

- **Frontend**: [Next.js 15](https://nextjs.org/) with App Router, [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS v4](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/)
- **Backend**: [Better Auth](https://github.com/ajonp/better-auth), [PostgreSQL](https://www.postgresql.org/) with [Docker](https://www.docker.com/)
- **Database**: [Prisma ORM](https://www.prisma.io/), [Kysely query builder](https://kysely.dev/)
- **Monorepo**: [Turborepo](https://turbo.build/) with [pnpm workspaces](https://pnpm.io/workspaces)
- **Development**: [Biome](https://biomejs.dev/), [Turbopack](https://turbo.build/pack), [React Scan](https://github.com/biomejs/biome)
- **Documentation**: [Nextra](https://nextra.site/) with [MDX](https://mdxjs.com/), [Storybook](https://storybook.js.org/)

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 22 or higher
- **pnpm**: Version 9.0.0 or higher
- **Docker**: For database setup and management

### Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/suiramdev/next-starter.git
   cd next-starter
   ```

2. **Install Dependencies**:

   ```bash
   pnpm install
   ```

### Environment Variables

Create a `.env` file in the root directory and populate it with the necessary environment variables:

| Variable Name                      | Description                                                    | Default Value                                                       |
| ---------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------- |
| `DATABASE_URL`                     | PostgreSQL connection string                                   | `postgresql://postgres:postgres@localhost:5432/postgres`            |
| `BETTER_AUTH_SECRET`               | Secret key for authentication (use strong value in production) | `secret`                                                            |
| `NEXT_PUBLIC_BETTER_AUTH_BASE_URL` | Base URL for auth service                                      | `http://localhost:3002`                                             |
| `CORS_ALLOWED_ORIGINS`             | Comma-separated list of allowed origins for CORS               | `http://localhost:3000,http://localhost:3001,http://localhost:3002` |

For a complete list of required environment variables and example values, refer to the [`.env.example`](./.env.example) file.

### Database Setup

1. **Start the Database**:

   ```bash
   docker compose up -d
   ```

2. **Generate Prisma Client and Run Migrations**:

   ```bash
   pnpm db:generate
   pnpm db:migrate
   ```

3. **Generate Authentication Schema**:

   ```bash
   pnpm auth:generate
   ```

### Running the Application

Start the development server:

```bash
pnpm dev
```

The applications will be accessible at:

- **Web App**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3001
- **Storybook**: http://localhost:4000
- **Documentation**: http://localhost:4001

## Project Structure

The project is organized into a monorepo architecture with the following structure:

```
apps/
├── web/                  # Main web application (port 3000)
├── admin/                # Admin dashboard (port 3001)
├── docs/                 # Documentation site (port 4001)
├── storybook/            # Component library (port 4000)
└── common/               # Shared API routes

packages/
├── auth/                 # Authentication system (Better Auth)
├── db/                   # Database layer (Prisma + Kysely)
├── ui/                   # Shared UI components
├── env/                  # Environment variable validation
├── biome-config/         # Shared linting configuration
└── typescript-config/    # Shared TypeScript configurations
```

This structure promotes modularity and reusability across the codebase.

## Available Scripts

### Development Commands

```bash
# Start all applications in development mode
pnpm dev

# Build all packages and applications
pnpm build

# Run linting across all packages
pnpm lint

# Format code across all packages
pnpm format

# Type check all packages
pnpm check-types
```

### Database Commands

```bash
# Generate Prisma client and types
pnpm db:generate

# Run database migrations
pnpm db:migrate

# Open Prisma Studio
pnpm db:studio

# Reset database (caution: deletes all data)
pnpm db:reset

# Deploy migrations to production
pnpm db:deploy

# Push schema changes without migrations
pnpm db:push
```

### Authentication Commands

```bash
# Generate authentication schema
pnpm auth:generate
```

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. **Fork the Repository**: Click the "Fork" button at the top right of the repository page
2. **Create a Branch**: Use a descriptive name for your branch (`git checkout -b feature/amazing-feature`)
3. **Make Changes**: Implement your feature or fix
4. **Test**: Ensure all tests pass and code follows the project standards
5. **Submit a Pull Request**: Provide a clear description of your changes

For detailed guidelines, please ensure your code follows the established patterns and includes appropriate tests.
