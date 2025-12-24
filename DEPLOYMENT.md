# Deployment Guide for Nixpacks

This guide explains how to deploy this monorepo using Nixpacks (used by Railway, Render, and other platforms).

## Prerequisites

1. **Nixpacks Configuration**: A `nixpacks.toml` file is included in the root directory
2. **Environment Variables**: Set the required environment variables in your deployment platform
3. **App Selection**: Specify which app to deploy (web, admin, common, or docs)

## Required Setup

### 1. Environment Variables

Set these in your deployment platform's environment variables:

#### For Turborepo App Selection:
- **`NIXPACKS_TURBO_APP_NAME`**: The name of the app to deploy
  - Options: `web`, `admin`, `common`, `docs`
  - Example: `NIXPACKS_TURBO_APP_NAME=web`

#### For Next.js Apps (web, admin, common, docs):
- **`PORT`**: Automatically set by most platforms, but ensure it's available
- **`NODE_ENV`**: Set to `production` for production deployments
- **`NEXT_TELEMETRY_DISABLED`**: Optional, set to `1` to disable telemetry

#### For Convex Integration:
- **`NEXT_PUBLIC_CONVEX_SITE_URL`**: Your Convex deployment URL
  - Format: `https://your-deployment.convex.cloud`
  - Get this from your Convex dashboard

#### For Better Auth:
- **`NEXT_PUBLIC_BETTER_AUTH_URL`**: Base URL for Better Auth API routes
  - Production: `https://your-domain.com/api/auth`
  - Note: If deploying the `common` app separately, this should point to where `/api/auth` is hosted

#### For Convex Backend (if deploying separately):
- **`SITE_URL`**: Your application's public URL
- **`BETTER_AUTH_SECRET`**: Secret key for auth (generate with `openssl rand -base64 32`)
- **`BETTER_AUTH_TRUSTED_ORIGINS`**: Comma-separated list of trusted origins

### 2. Platform-Specific Configuration

#### Railway

1. **Create a new service** from your repository
2. **Set the root directory** (alternative to `NIXPACKS_TURBO_APP_NAME`):
   - Go to Settings → Source
   - Set "Root Directory" to the app directory (e.g., `apps/web`)
3. **Set environment variables** in the Variables tab
4. **Deploy**

#### Render

1. **Create a new Web Service** from your repository
2. **Set the root directory**:
   - In the service settings, set "Root Directory" to the app directory
3. **Set environment variables** in the Environment tab
4. **Set build command** (if root directory method doesn't work):
   - `cd apps/web && pnpm install && pnpm build`
5. **Set start command**:
   - `cd apps/web && pnpm start`

#### Other Platforms

For platforms that support Nixpacks:
- Set `NIXPACKS_TURBO_APP_NAME` environment variable to the app name
- Or configure the root directory to point to the specific app directory

## Deployment Strategies

### Option 1: Deploy Individual Apps (Recommended)

Deploy each app as a separate service:

1. **Web App** (`apps/web`):
   - Set `NIXPACKS_TURBO_APP_NAME=web`
   - Or set root directory to `apps/web`

2. **Admin App** (`apps/admin`):
   - Set `NIXPACKS_TURBO_APP_NAME=admin`
   - Or set root directory to `apps/admin`

3. **Common App** (`apps/common`):
   - Set `NIXPACKS_TURBO_APP_NAME=common`
   - Or set root directory to `apps/common`
   - This app handles `/api/auth/*` routes

4. **Docs App** (`apps/docs`):
   - Set `NIXPACKS_TURBO_APP_NAME=docs`
   - Or set root directory to `apps/docs`

### Option 2: Deploy from Root with Environment Variable

1. Keep the repository root as the root directory
2. Set `NIXPACKS_TURBO_APP_NAME` to the app you want to deploy
3. Nixpacks will build and start the specified app

## Build Process

The `nixpacks.toml` configuration:

1. **Setup Phase**: Installs Node.js 22
2. **Install Phase**: 
   - Enables Corepack
   - Activates pnpm 10.25.0
   - Runs `pnpm install --frozen-lockfile` from the root
   - Only includes necessary files for efficient caching
3. **Build Phase**: 
   - Runs `pnpm build` which uses Turborepo
   - Builds the specified app and its dependencies
4. **Start Phase**: 
   - Changes to the app directory
   - Runs `pnpm start` (which executes `next start`)

## Troubleshooting

### Build Fails with "Cannot find module"

- Ensure all workspace dependencies are properly listed in `package.json` files
- Check that `pnpm-workspace.yaml` includes all necessary packages
- Verify that the build phase runs from the repository root

### App Doesn't Start

- Verify the `PORT` environment variable is set (usually automatic)
- Check that the app's `package.json` has a `start` script
- Ensure the build completed successfully

### Wrong App is Deployed

- Verify `NIXPACKS_TURBO_APP_NAME` is set correctly
- Or check that the root directory is set to the correct app directory
- Ensure the platform is reading the `nixpacks.toml` file

### Environment Variables Not Available

- Ensure all `NEXT_PUBLIC_*` variables are set before the build phase
- Regular environment variables can be set at runtime
- Check your platform's documentation for when variables are available

## Additional Notes

- The `nixpacks.toml` file optimizes the install phase by only including necessary files
- This reduces build times by improving cache efficiency
- All apps share the same build configuration but deploy independently
- Each app can have its own environment variables

## See Also

- [Environment Variables Reference](./ENV_VARIABLES.md) for complete list of required variables
- [Nixpacks Documentation](https://nixpacks.com/docs) for advanced configuration
- [Turborepo Documentation](https://turbo.build/repo/docs) for monorepo build details

