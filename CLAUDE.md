# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build and Development Commands

### Development
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production (includes TypeScript compilation)
- `npm run lint` - Run ESLint for code quality checks
- `npm run preview` - Preview production build locally

### Notes
- No test framework is currently configured
- TypeScript compilation is included in the build step
- Development server runs with Vite and supports HMR

## Architecture Overview

### Technology Stack
- **Frontend**: React 19.1.1 with TypeScript and Vite
- **UI Components**: HeroUI design system + shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with custom theme configuration
- **State Management**: TanStack Query for server state, Zustand for client state
- **Backend**: Supabase (authentication, database, real-time subscriptions)
- **Routing**: React Router DOM

### Project Structure
```
src/
├── app/                 # Application entry and providers
├── components/          # Reusable UI components
├── config/              # App configuration (navigation)
├── features/            # Feature-based modules (see below)
├── hooks/               # Custom React hooks
├── layouts/             # Layout components
├── lib/                 # Utilities (supabase, formatting, env)
├── pages/               # Page-level components
├── types/               # TypeScript definitions
```

### Feature-Based Architecture
Each feature follows this structure:
```
src/features/{feature-name}/
├── api.ts              # Supabase API calls
├── components/         # Feature-specific components
├── hooks/              # Feature-specific hooks
├── mutations.ts        # TanStack Query mutations
├── queries.ts          # TanStack Query queries
├── types.ts           # Feature-specific types
```

Key features include: `pos`, `produk`, `sales`, `purchases`, `inventory`, `customers`, `suppliers`, `dashboard`, `auth`, `roles`, `returns`, `stock-opname`, `pesan` (messaging).

### Real-time System
The application has sophisticated real-time capabilities:
- Monitors 11+ tables for automatic stock updates
- Custom hooks: `useRealtimeQueryInvalidation`, `useRealtimeStockCache`, `useProductsWithRealtimeStocks`
- Handles purchase/sales transactions, returns, and stock adjustments in real-time
- Configuration in `src/lib/supabase-realtime-config.ts`

### Path Aliases
- `@/*` maps to `src/*` (configured in tsconfig.json and vite.config.ts)

## Code Conventions

### TypeScript
- Strict mode enabled with no unused variables/parameters
- Use `satisfies` operator for type assertions
- PascalCase for interfaces/types (e.g., `Product`, `UserInput`)
- Explicit null/undefined handling

### React Patterns
- Functional components with hooks
- Forward refs for composable components
- Class Variance Authority (CVA) for component variants
- Radix UI primitives for accessibility

### State Management
- TanStack Query for all server state with proper query keys
- Zustand stores for client-side state
- Real-time subscriptions via custom hooks
- Query keys organized in separate `keys.ts` files

### API Layer
- Supabase client configured in `src/lib/supabase-client.ts`
- API functions throw errors for React Query error handling
- Consistent error handling with try/catch in mutations

### Naming Conventions
- **Variables/Functions**: camelCase (`productName`, `fetchProducts`)
- **Components**: PascalCase (`ProductTable`, `UserForm`)
- **Types/Interfaces**: PascalCase (`Product`, `Category`)
- **Constants**: UPPER_SNAKE_CASE (`PRODUCTS_QUERY_KEY`)
- **Files**: kebab-case for components/pages, camelCase for utilities

## Important Notes

### Application Context
This is a comprehensive Point of Sale (POS) system called "KasirPro" featuring:
- Multi-tenant architecture with stores and tenant management
- Complete inventory management with real-time stock tracking
- Sales and purchase transaction processing
- Customer and supplier management
- Role-based access control
- Returns processing (both sales and purchase returns)
- Stock adjustments and auditing
- Dashboard with analytics and reporting

### Development Considerations
- The application heavily relies on real-time data synchronization
- Always consider multi-tenant data isolation when working with database queries
- Stock calculations are critical and automated across the system
- UI components follow HeroUI design patterns with Tailwind styling
- Authentication and authorization are handled via Supabase