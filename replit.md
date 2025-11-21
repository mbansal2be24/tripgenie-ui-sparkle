# TripGenie - AI Travel Planning Application

## Project Overview
TripGenie is an AI-powered travel planning application that helps users create personalized itineraries based on their preferences, budget, and travel style.

## Technology Stack
- **Frontend**: React 18 with TypeScript
- **Router**: Wouter (lightweight router)
- **Backend**: Express.js (Node.js)
- **Build Tool**: Vite
- **UI Components**: Shadcn UI with Radix UI primitives
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query (React Query)
- **Forms**: React Hook Form with Zod validation

## Project Structure
```
├── client/                 # Frontend application
│   ├── public/            # Static assets
│   └── src/
│       ├── components/    # React components
│       │   ├── layout/    # Layout components (Navbar, Footer)
│       │   └── ui/        # Shadcn UI components
│       ├── hooks/         # Custom React hooks
│       ├── lib/           # Utility libraries
│       ├── pages/         # Page components
│       └── App.tsx        # Root component
├── server/                # Backend server
│   ├── index.ts          # Express server entry point
│   ├── routes.ts         # API routes
│   ├── storage.ts        # Data storage interface
│   └── vite.ts           # Vite dev server setup
├── shared/                # Shared types and schemas
│   └── schema.ts         # Data models
└── vite.config.ts        # Vite configuration

## Recent Migration (Lovable to Replit)
**Date**: November 21, 2025
**Status**: In Progress

### Completed Steps
- ✅ Restructured project from single-directory Vite app to fullstack template
- ✅ Installed backend dependencies (Express, Drizzle ORM, etc.)
- ✅ Migrated from React Router DOM to Wouter
- ✅ Created Express server with Vite integration
- ✅ Updated all configuration files (package.json, tsconfig, vite.config.ts)
- ✅ Moved all frontend files to `client/` directory
- ✅ Created `server/` and `shared/` directories for backend structure

### Current Issues
- ⚠️ Vite alias configuration causing path resolution issues
- ⚠️ TSX watch causing infinite restart loop due to vite.config.ts timestamp files

### Pages
1. **Home** (`/`) - Trip planning input form with destination, budget, days, interests
2. **Dashboard** (`/dashboard`) - Trip overview with destination, duration, budget cards
3. **Itinerary** (`/itinerary`) - Detailed day-by-day itinerary
4. **Plan B** (`/plan-b`) - Indoor alternatives for bad weather
5. **Nearby** (`/nearby`) - Nearby attractions and restaurants

## Features
- AI-powered trip suggestions
- Weather-based Plan B recommendations
- Budget tracking
- Interest-based activity filtering
- Responsive design with dark mode support

## Development Notes
- Server runs on port 5000
- Frontend uses Shadcn UI components with Tailwind CSS
- All routing done client-side with Wouter
- Backend API endpoints to be implemented in `server/routes.ts`
- Storage layer uses in-memory storage by default (can be switched to database)
