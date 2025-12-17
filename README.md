# Next Starter

A modern, production-ready boilerplate for building full-stack applications with Next.js, Convex, and TypeScript. This monorepo provides a solid foundation for rapid development with authentication, admin panels, and example applications.

## Overview

**Next Starter** is a comprehensive boilerplate that combines the power of Next.js 16, Convex backend, and modern React patterns to help you kickstart your projects quickly. It includes:

- **Monorepo architecture** using Turborepo for efficient builds and development
- **Type-safe backend** with Convex for real-time data and serverless functions
- **Authentication system** powered by Better Auth with Convex adapter
- **Shared UI components** built with shadcn/ui and Tailwind CSS
- **Multiple applications** ready for different use cases

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **React**: 19.2.0
- **Backend**: Convex
- **Authentication**: Better Auth with Convex adapter
- **Styling**: Tailwind CSS 4
- **Type Safety**: TypeScript 5.9
- **Code Quality**: Biome
- **Package Manager**: pnpm 9.0.0
- **Monorepo**: Turborepo

## Applications

### Admin App (`apps/admin`)

The **Admin App** is a comprehensive administration panel designed for managing your applications, users, and organizations. It provides a complete admin interface with:

- **User Management**: View, manage, and moderate users across your platform
- **Organization Management**: Create and manage organizations with multi-tenant support
- **Member Management**: Add, remove, and manage members within organizations
- **Authentication**: Secure sign-in/sign-up flows with protected routes
- **Dashboard**: Centralized overview of your platform's key metrics

The admin app features a modern sidebar navigation, breadcrumb navigation, and a responsive design built with shadcn/ui components. It's fully integrated with Convex for real-time data updates and uses Better Auth for secure authentication.

**Key Features:**

- Protected routes with authentication
- Multi-organization support
- User ban/moderation capabilities
- Real-time data synchronization
- Responsive admin interface

### Web App (`apps/web`)

The **Web App** serves as an example application demonstrating how to build interactive, engaging experiences with the Next Starter boilerplate. Currently, it's planned to be a **Spotify Blind Test Game** - an interactive music guessing game where players listen to track snippets and try to identify the track, artist, or album.

This application will showcase:

- Integration with external APIs (Spotify)
- Real-time game mechanics
- User interactions and scoring
- Modern, engaging UI/UX

The web app demonstrates how to leverage the shared UI components and Convex backend to build feature-rich applications quickly.

## Project Structure

```
next-starter/
├── apps/
│   ├── admin/          # Admin panel application
│   ├── web/            # Example web application (Spotify Blind Test)
│   ├── docs/           # Documentation site
│   ├── common/         # Shared API routes
│   └── storybook/      # Component documentation
├── packages/
│   ├── auth/           # Authentication utilities
│   ├── convex/         # Convex backend schema and functions
│   ├── ui/             # Shared UI components
│   ├── biome-config/   # Shared Biome configuration
│   └── typescript-config/ # Shared TypeScript configurations
└── turbo.json          # Turborepo configuration
```
