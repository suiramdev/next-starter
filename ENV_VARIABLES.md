# Environment Variables Reference

This document lists all environment variables required across the project.

## Required Environment Variables

### Convex Configuration

#### `NEXT_PUBLIC_CONVEX_SITE_URL` (Required)

- **Where**: Frontend apps (`apps/admin`, `apps/web`, etc.)
- **Purpose**: Convex deployment URL for client-side connections
- **Format**: `https://your-deployment.convex.cloud`
- **How to get**: Available in your Convex dashboard after deployment
- **Used in**:
  - `apps/admin/app/_components/convex-provider.tsx`
  - `apps/admin/lib/convex-server.ts`
  - Other frontend apps using Convex

#### `CONVEX_SITE_URL` (Optional)

- **Where**: Convex backend (`packages/convex`)
- **Purpose**: Site URL for Convex auth configuration
- **Used in**: `packages/convex/convex/auth.config.ts`
- **Note**: Usually same as `NEXT_PUBLIC_CONVEX_SITE_URL` or your app's public URL

### Better Auth Configuration

#### `BETTER_AUTH_SECRET` (Required)

- **Where**: Convex backend (`packages/convex`)
- **Purpose**: Secret key for signing and encrypting auth tokens
- **How to generate**: `openssl rand -base64 32`
- **Used in**: `packages/convex/convex/auth.ts`
- **Security**: Keep this secret! Never commit to version control.

#### `NEXT_PUBLIC_BETTER_AUTH_URL` (Required)

- **Where**: Frontend apps
- **Purpose**: Base URL for Better Auth API routes
- **Development**: `http://127.0.0.1:3024/api/auth` (using microfrontend proxy port)
- **Production**: `https://your-domain.com/api/auth`
- **Used in**:
  - `apps/admin/lib/auth-client.ts`
  - `packages/auth/src/helpers/react/client.ts`

#### `SITE_URL` (Required)

- **Where**: Convex backend (`packages/convex`)
- **Purpose**: Base URL for Better Auth configuration
- **Development**: `http://127.0.0.1:3024` (microfrontend proxy port)
- **Production**: Your application's public URL
- **Used in**: `packages/convex/convex/auth.ts`

#### `BETTER_AUTH_TRUSTED_ORIGINS` (Optional)

- **Where**: Convex backend (`packages/convex`)
- **Purpose**: Comma-separated list of trusted origins for CORS
- **Development**: `http://127.0.0.1:3024` (microfrontend proxy port)
- **Production**: `https://yourdomain.com`
- **Used in**: `packages/convex/convex/auth.ts`
- **Default**: Empty array (no trusted origins)

### Development Configuration

#### `TURBO_MFE_PORT` (Optional - for development)

- **Where**: All Next.js apps
- **Purpose**: Port number for micro-frontend apps in development
- **Format**: Port number (e.g., `3000`, `3001`, `3002`)
- **Used in**: `package.json` scripts for `dev` command
- **Note**: Set by Turbo automatically, but can be overridden

#### `CORS_ALLOWED_ORIGINS` (Optional)

- **Where**: `apps/common`
- **Purpose**: Comma-separated list of allowed CORS origins
- **Format**: `http://127.0.0.1:3000,http://127.0.0.1:3001`
- **Used in**: `apps/common/proxy.ts`
- **Note**: In development, all origins are allowed if not set

#### `NODE_ENV` (Automatic)

- **Where**: All apps
- **Purpose**: Node.js environment
- **Values**: `development`, `production`, `test`
- **Note**: Automatically set by Next.js, but can be overridden

## Environment Variable Setup by Location

### Convex Backend (`packages/convex`)

Set these in your Convex dashboard or `.env.local`:

- `SITE_URL`
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_TRUSTED_ORIGINS` (optional)
- `CONVEX_SITE_URL` (optional)

### Frontend Apps (`apps/admin`, `apps/web`, etc.)

Set these in `.env.local`:

- `NEXT_PUBLIC_CONVEX_SITE_URL`
- `NEXT_PUBLIC_CONVEX_SITE_URL` (should match `NEXT_PUBLIC_CONVEX_SITE_URL`)
- `NEXT_PUBLIC_BETTER_AUTH_URL`
- `TURBO_MFE_PORT` (optional, for development)

### Common App (`apps/common`)

Set these in `.env.local`:

- `NEXT_PUBLIC_CONVEX_SITE_URL`
- `NEXT_PUBLIC_CONVEX_SITE_URL` (should match `NEXT_PUBLIC_CONVEX_SITE_URL`)
- `NEXT_PUBLIC_BETTER_AUTH_URL`
- `CORS_ALLOWED_ORIGINS` (optional)
- `TURBO_MFE_PORT` (optional, for development)

## Local Development Examples

Here are concrete values you can use for local development:

### Step 1: Start Convex Dev Server

```bash
cd packages/convex
npx convex dev
```

This will output a URL like: `https://happy-animal-123.convex.cloud` - **copy this URL**.

### Step 2: Generate Better Auth Secret

```bash
openssl rand -base64 32
```

Example output: `xK9mP2qR7vN4wL8jT5yU3zA6bC1dE9fG0hI2jK4lM6nO8pQ0rS2tU4vW6xY8zA=`

### Step 3: Set Convex Environment Variables

```bash
cd packages/convex
npx convex env set SITE_URL http://127.0.0.1:3024
npx convex env set BETTER_AUTH_SECRET <generated-secret>
npx convex env set BETTER_AUTH_TRUSTED_ORIGINS http://127.0.0.1:3024
```

### Step 4: Create `.env.local` Files

**`apps/admin/.env.local`**:

```bash
# Replace with your actual Convex URL from Step 1
NEXT_PUBLIC_CONVEX_SITE_URL=https://happy-animal-123.convex.cloud
NEXT_PUBLIC_CONVEX_SITE_URL=https://happy-animal-123.convex.cloud
NEXT_PUBLIC_BETTER_AUTH_URL=http://127.0.0.1:3024/api/auth
TURBO_MFE_PORT=3000
```

**`apps/common/.env.local`**:

```bash
# Replace with your actual Convex URL from Step 1
NEXT_PUBLIC_CONVEX_SITE_URL=https://happy-animal-123.convex.cloud
NEXT_PUBLIC_CONVEX_SITE_URL=https://happy-animal-123.convex.cloud
NEXT_PUBLIC_BETTER_AUTH_URL=http://127.0.0.1:3024/api/auth
TURBO_MFE_PORT=3001
CORS_ALLOWED_ORIGINS=http://127.0.0.1:3024
```

**`apps/web/.env.local`** (if using Convex):

```bash
NEXT_PUBLIC_CONVEX_SITE_URL=https://happy-animal-123.convex.cloud
NEXT_PUBLIC_CONVEX_SITE_URL=https://happy-animal-123.convex.cloud
NEXT_PUBLIC_BETTER_AUTH_URL=http://127.0.0.1:3024/api/auth
TURBO_MFE_PORT=3002
```

**`apps/docs/.env.local`** (if using Convex):

```bash
NEXT_PUBLIC_CONVEX_SITE_URL=https://happy-animal-123.convex.cloud
NEXT_PUBLIC_CONVEX_SITE_URL=https://happy-animal-123.convex.cloud
NEXT_PUBLIC_BETTER_AUTH_URL=http://127.0.0.1:3024/api/auth
TURBO_MFE_PORT=3003
```

### Microfrontend Architecture

This project uses a microfrontend setup with a proxy on port **3024**. Routes are distributed as follows:

- **Main Proxy**: `http://127.0.0.1:3024` (handles all routing)
- **Web app**: Root `/` → `http://127.0.0.1:3024/`
- **Admin app**: `/admin/*` → `http://127.0.0.1:3024/admin/*`
- **Common app**: `/common/*` → `http://127.0.0.1:3024/common/*` (includes `/api/auth/*`)
- **Docs app**: `/docs/*` → `http://127.0.0.1:3024/docs/*`

**Auth API Routes**: Accessible at `http://127.0.0.1:3024/api/auth/*` (routed through common app)

### Internal Port Assignments (Managed by Turbo)

- **Admin app**: `3000` (internal, proxied via 3024)
- **Common app**: `3001` (internal, proxied via 3024)
- **Web app**: `3002` (internal, proxied via 3024)
- **Docs app**: `3003` (internal, proxied via 3024)

### Complete Local Development Setup

**Convex Backend** (`packages/convex`):

- `SITE_URL=http://127.0.0.1:3024`
- `BETTER_AUTH_SECRET=<generated-secret>`
- `BETTER_AUTH_TRUSTED_ORIGINS=http://127.0.0.1:3024`

**Admin App** (`apps/admin/.env.local`):

- `NEXT_PUBLIC_CONVEX_SITE_URL=https://your-dev-deployment.convex.cloud`
- `NEXT_PUBLIC_CONVEX_SITE_URL=https://your-dev-deployment.convex.cloud`
- `NEXT_PUBLIC_BETTER_AUTH_URL=http://127.0.0.1:3024/api/auth`
- `TURBO_MFE_PORT=3000`

**Common App** (`apps/common/.env.local`):

- `NEXT_PUBLIC_CONVEX_SITE_URL=https://your-dev-deployment.convex.cloud`
- `NEXT_PUBLIC_CONVEX_SITE_URL=https://your-dev-deployment.convex.cloud`
- `NEXT_PUBLIC_BETTER_AUTH_URL=http://127.0.0.1:3024/api/auth`
- `TURBO_MFE_PORT=3001`
- `CORS_ALLOWED_ORIGINS=http://127.0.0.1:3024`

**Web App** (`apps/web/.env.local`):

- `NEXT_PUBLIC_CONVEX_SITE_URL=https://your-dev-deployment.convex.cloud`
- `NEXT_PUBLIC_CONVEX_SITE_URL=https://your-dev-deployment.convex.cloud`
- `NEXT_PUBLIC_BETTER_AUTH_URL=http://127.0.0.1:3024/api/auth`
- `TURBO_MFE_PORT=3002`

## Quick Setup Guide

1. **Get Convex URL**:

   ```bash
   cd packages/convex
   npx convex dev
   # Copy the URL shown (e.g., https://happy-animal-123.convex.cloud)
   ```

2. **Generate Better Auth Secret**:

   ```bash
   openssl rand -base64 32
   ```

3. **Set Convex environment variables**:

   ```bash
   cd packages/convex
   npx convex env set SITE_URL http://127.0.0.1:3024
   npx convex env set BETTER_AUTH_SECRET <your-generated-secret>
   npx convex env set BETTER_AUTH_TRUSTED_ORIGINS http://127.0.0.1:3024
   ```

4. **Create `.env.local` files** in each app directory (see examples above)

## Security Notes

- Never commit `.env.local` files to version control
- `BETTER_AUTH_SECRET` must be kept secret
- Use different secrets for development and production
- `NEXT_PUBLIC_*` variables are exposed to the browser, so don't put secrets there
