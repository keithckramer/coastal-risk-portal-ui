# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Coastal Risk Portal UI - A React-based web application for viewing upcoming insurance policy renewals. The app displays policies expiring within a configurable timeframe and connects to a backend API running at `https://localhost:7246`.

## Development Commands

### Running the Development Server
```bash
npm run dev
```
Starts Vite dev server with HMR (Hot Module Replacement).

### Building for Production
```bash
npm run build
```
Runs TypeScript compiler check (`tsc -b`) followed by Vite production build. Output goes to `dist/`.

### Linting
```bash
npm run lint
```
Runs ESLint across the codebase.

### Preview Production Build
```bash
npm run preview
```
Serves the production build locally for testing.

## Tech Stack

- **React 19.2** with TypeScript
- **Vite 7.2** for build tooling
- **ESLint** for code quality
- No state management library (using React hooks)
- No routing library (single-page view)

## Architecture

### Application Structure

The application follows a **feature-based architecture** with clear separation of concerns:

```
src/
├── components/           # Reusable UI components
│   └── common/
│       ├── Table.tsx           - Generic table with TypeScript generics
│       ├── Input.tsx           - Form input with label and error support
│       ├── LoadingSpinner.tsx  - Loading state indicator
│       └── ErrorMessage.tsx    - Error display component
│
├── features/            # Feature modules (domain-driven)
│   └── renewals/
│       ├── RenewalsPage.tsx              - Main page component
│       ├── components/
│       │   ├── RenewalsTable.tsx         - Table specific to renewals
│       │   └── RenewalsFilters.tsx       - Filter controls
│       └── hooks/
│           └── useRenewals.ts            - Custom hook for data fetching
│
├── services/            # API layer
│   ├── api.ts                  - Base API client with interceptors
│   └── renewals.service.ts     - Renewals API functions
│
├── lib/                 # Utilities and shared code
│   ├── constants.ts            - App constants and configuration
│   └── formatters.ts           - Display formatting utilities
│
├── types.ts            - Shared TypeScript interfaces
├── App.tsx             - Root component (router setup placeholder)
├── main.tsx            - Application entry point
└── index.css           - Global styles
```

### Data Flow Architecture

1. **Component Layer**: `RenewalsPage.tsx` orchestrates the feature
   - Uses `useState` for local UI state (filter values)
   - Delegates data fetching to custom hook

2. **Hook Layer**: `useRenewals` encapsulates business logic
   - Manages API call lifecycle (loading, error, success states)
   - Provides clean interface to components
   - Handles side effects with `useEffect`

3. **Service Layer**: Clean separation of API concerns
   - `api.ts` - Base HTTP client with:
     - Request/response interceptors (ready for auth tokens)
     - Centralized error handling
     - Timeout support (30s default)
     - Custom `ApiError` class for structured errors
   - `renewals.service.ts` - Domain-specific API calls

4. **Configuration**: Environment-based config
   - API base URL from `.env` via Vite env variables
   - Constants defined in `lib/constants.ts`
   - `.env.example` provided for easy setup

### Key Patterns & Best Practices

**Component Composition**:
- Small, focused components with single responsibility
- Reusable components in `components/common/`
- Feature-specific components co-located with their features

**Type Safety**:
- Generic `Table<T>` component for type-safe table rendering
- Proper TypeScript interfaces throughout
- No `any` types used

**Error Handling**:
- Custom `ApiError` class with status codes
- Graceful error display in UI
- Timeout handling for slow API calls

**Code Quality**:
- JSDoc comments on all major functions
- Clear naming conventions
- Separation of concerns (presentation vs. logic)

### Environment Configuration

API configuration is managed via environment variables:

```bash
# .env
VITE_API_BASE_URL=https://localhost:7246
VITE_APP_ENV=development
```

All environment variables must be prefixed with `VITE_` to be exposed to the client.

## Important Notes

- **Backend API**: Must be running at the URL specified in `.env` (default: `https://localhost:7246`)
- **Environment Setup**: Copy `.env.example` to `.env` and adjust as needed
- **Styling**: Currently using inline styles; ready for CSS framework integration (Tailwind, MUI, etc.)
- **Testing**: No test suite configured yet (Playwright recommended for E2E tests)
- **State Management**: Using React hooks; ready to integrate React Query or Redux if needed
- **Routing**: App.tsx prepared for React Router integration

## Authentication & Authorization

### Authentication Flow

The application implements **JWT-based authentication** with the following features:

1. **Login/Logout**: Full authentication flow with token management
2. **Protected Routes**: Automatic redirect to login for unauthenticated users
3. **Token Storage**: Secure local storage of JWT tokens
4. **API Integration**: Automatic injection of Bearer tokens in API requests
5. **Role-Based Access**: Support for role-based authorization (hasRole helper)

### Authentication Architecture

```
src/
├── contexts/
│   └── AuthContext.tsx         # Global auth state management
├── features/auth/
│   └── LoginPage.tsx          # Login form and flow
├── components/auth/
│   └── ProtectedRoute.tsx     # Route protection wrapper
├── services/
│   └── auth.service.ts        # Auth API calls (login, logout, refresh)
├── lib/
│   └── storage.ts             # Local storage utilities
└── types/
    └── auth.ts                # Auth-related TypeScript types
```

### Using Authentication

**In Components:**
```typescript
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout, hasRole } = useAuth();

  if (!isAuthenticated) return <LoginPrompt />;
  if (!hasRole('admin')) return <Forbidden />;

  return <div>Welcome {user?.name}</div>;
}
```

**Protected Routes:**
```typescript
<Route path="/admin" element={
  <ProtectedRoute requiredRole="admin">
    <AdminPage />
  </ProtectedRoute>
} />
```

### API Integration

The API client (`src/services/api.ts`) automatically includes JWT tokens:

```typescript
// Tokens are automatically added to requests
const data = await apiClient.get('/api/protected-resource');
// Header: Authorization: Bearer <token>
```

### Authentication Endpoints

Expected backend API endpoints (`.NET` implementation):

- `POST /api/auth/login` - Authenticate user, returns JWT token
- `POST /api/auth/logout` - Invalidate current session
- `POST /api/auth/refresh` - Refresh expired token
- `GET /api/auth/me` - Get current user profile

## Routing Structure

The application uses **React Router v6** with the following routes:

| Route | Access | Description |
|-------|--------|-------------|
| `/login` | Public | Login page |
| `/` | Protected | Dashboard (landing page) |
| `/renewals` | Protected | Policy renewals management |
| `/policies` | Protected | Policy management (placeholder) |
| `/claims` | Protected | Claims management (placeholder) |

### Route Protection

All routes except `/login` are wrapped in `ProtectedRoute`:
- Redirects unauthenticated users to `/login`
- Preserves intended destination for post-login redirect
- Supports role-based access control

## Development Mode & Mock Authentication

### Mock Authentication (Development)

The application includes a **mock authentication mode** for frontend development without a backend:

**Enabled by default** in `src/lib/constants.ts`:
```typescript
export const DEV_CONFIG = {
  MOCK_AUTH: true, // Set to false when backend is ready
} as const;
```

**How it works**:
- Client-side credential validation
- Simulated network delay (500ms)
- Generates mock JWT tokens
- Stores tokens in localStorage (same as real auth)
- Console warning when mock mode is active

**Demo Credentials**:

| Email | Password | Roles |
|-------|----------|-------|
| demo@amcoastal.com | demo123 | user, viewer |
| admin@amcoastal.com | admin123 | user, admin |

### Switching to Real Backend

1. Set `DEV_CONFIG.MOCK_AUTH = false` in `src/lib/constants.ts`
2. Ensure backend is running at the URL in `.env`
3. Backend must implement endpoints in `BACKEND.md`

See **BACKEND.md** for complete .NET implementation guide.

## Testing

### Playwright E2E Tests

The application includes **comprehensive end-to-end tests** using Playwright:

**Test Coverage**:
- ✅ Authentication flows (login, logout, session persistence)
- ✅ Protected route access control
- ✅ Navigation between pages
- ✅ Form validation
- ✅ Multi-browser compatibility (Chromium, Firefox, WebKit)
- ✅ Dashboard functionality
- ✅ Renewals page filtering

**Test Organization**:
```
tests/e2e/
├── helpers/
│   └── auth.helper.ts       # Reusable auth functions
├── auth.spec.ts             # Authentication tests
├── navigation.spec.ts       # Routing and navigation tests
└── renewals.spec.ts         # Renewals page tests
```

### Running Tests

**Run all tests** (headless, all browsers):
```bash
npm test
```

**Run with UI mode** (interactive debugging):
```bash
npm run test:ui
```

**Run in headed mode** (see browser):
```bash
npm run test:headed
```

**Run specific browser**:
```bash
npm run test:chromium
npm run test:firefox
npm run test:webkit
```

**View test report**:
```bash
npm run test:report
```

### CI/CD Integration

**GitHub Actions Workflows**:
- `.github/workflows/ci.yml` - Full CI pipeline with matrix testing
- `.github/workflows/playwright.yml` - Dedicated Playwright test workflow

**CI Pipeline includes**:
1. TypeScript compilation check
2. ESLint code quality scan
3. Production build
4. Multi-browser E2E tests (parallel)
5. Test report artifacts

### Test Configuration

See `playwright.config.ts` for:
- Multi-browser setup (Chrome, Firefox, Safari)
- Auto-start dev server
- Screenshot/video on failure
- Trace collection for debugging
- Retry logic for CI environments

### Next Steps for Production

1. ✅ ~~Add React Router for multi-page navigation~~ (COMPLETED)
2. ✅ ~~Implement authentication (JWT tokens via API interceptors)~~ (COMPLETED)
3. ✅ ~~Set up Playwright for E2E testing~~ (COMPLETED)
4. Integrate a component library (shadcn/ui, MUI, or Mantine)
5. Add SonarCube configuration for code quality scanning
6. ✅ ~~Configure CI/CD pipeline (GitHub Actions)~~ (COMPLETED)
7. Implement Azure AD integration for enterprise SSO
8. Add refresh token rotation for enhanced security
9. Add API integration tests
10. Set up Azure DevOps pipeline (alternative to GitHub Actions)
