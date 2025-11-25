# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Coastal Risk Portal UI is a React + TypeScript + Vite application for managing and viewing coastal insurance policy renewals. The application displays upcoming policy renewals with details about properties, premiums, and claims.

## Development Commands

```bash
# Start development server with HMR
npm run dev

# Build for production (runs TypeScript compiler then Vite build)
npm run build

# Lint code
npm run lint

# Preview production build
npm run preview
```

## Architecture

### Tech Stack
- **Frontend Framework**: React 19.2 with TypeScript
- **Build Tool**: Vite 7.2 with @vitejs/plugin-react
- **Linting**: ESLint 9 with TypeScript ESLint, React Hooks, and React Refresh plugins

### Project Structure
The application follows a simple flat structure:
- `src/App.tsx` - Main application component displaying renewals table with filtering
- `src/main.tsx` - Application entry point
- `src/api.ts` - API client functions for backend communication
- `src/types.ts` - TypeScript type definitions
- `src/index.css` & `src/App.css` - Styling

### API Integration
The app connects to a .NET backend API running on `https://localhost:7246`. The primary endpoint is:
- `GET /api/renewals?days={days}` - Returns upcoming policy renewals within specified days

The API base URL is hardcoded in `src/api.ts:3` and should be configured via environment variables for different environments.

### Data Flow
1. User sets the "days to expiration" filter (default: 60 days)
2. `App.tsx` calls `fetchUpcomingRenewals(days)` via useEffect
3. API returns array of `UpcomingRenewal` objects
4. Data is rendered in a tabular format showing policy details, location, expiration, premium, and open claims

### Type System
The core type is `UpcomingRenewal` (defined in `src/types.ts`), which represents a policy renewal with all associated metadata including building information, dates, premium amounts, and claim counts.

## Configuration Notes

### TypeScript
The project uses composite TypeScript configuration:
- `tsconfig.json` - Root config referencing app and node configs
- `tsconfig.app.json` - Application source configuration
- `tsconfig.node.json` - Vite config file configuration

### ESLint
Configured with flat config format (`eslint.config.js`) including:
- Recommended JS and TypeScript rules
- React Hooks rules
- React Refresh rules for Vite HMR
- Browser globals
- Use Context7 to check up-to-date docs when needed for implementing new libraries or frameworks, or adding features using them.