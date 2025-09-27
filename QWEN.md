# Qwen Code - KasirPro Project Documentation

## Project Overview

KasirPro is a modern Point of Sale (POS) web application built with React, TypeScript, and Vite. It's a comprehensive retail management system featuring inventory tracking, sales processing, purchasing, customer management, and real-time stock updates. The application uses Supabase as its backend service for authentication, database, and real-time capabilities.

### Key Technologies
- **Frontend Framework**: React 19.1.1 with TypeScript
- **Build Tool**: Vite 7.1.7
- **UI Components**: HeroUI and shadcn/ui components with Tailwind CSS
- **State Management**: TanStack Query for server state, Zustand for client state
- **Routing**: React Router DOM
- **Database/Authentication**: Supabase
- **Styling**: Tailwind CSS with custom theme
- **Icons**: Lucide React

## Project Architecture

### Directory Structure
```
src/
├── app/                 # Application entry points and routing
├── assets/              # Static assets (images, fonts, etc.)
├── components/          # Reusable UI components
├── config/              # Application configuration
├── features/            # Feature-specific modules
├── hooks/               # Custom React hooks
├── layouts/             # Layout components
├── lib/                 # Utility functions and libraries
├── pages/               # Page components
├── types/               # TypeScript type definitions
```

### Key Features
- **Real-time Stock Management**: Automatic updates when purchases, sales, or returns occur
- **Multi-tenant Support**: With tenants and stores management
- **Comprehensive POS System**: Point of sale interface with inventory tracking
- **Inventory Management**: Product, category, and brand management
- **Sales & Purchases**: Complete transaction tracking
- **Reporting & Analytics**: Dashboard with metrics and charts
- **User Management**: Roles, permissions, and authentication
- **Return Management**: Both sales and purchase returns

## Building and Running

### Development
```bash
npm run dev  # Start development server
```

### Production
```bash
npm run build    # Build for production (includes TypeScript compilation)
npm run preview  # Preview production build
```

### Code Quality
```bash
npm run lint     # Run ESLint
```

## Development Conventions

### Imports & Structure
- Use path aliases: `@/*` for src imports
- Feature-based organization: `src/features/{feature-name}/{api,hooks,components,queries}`
- Type definitions in `src/types/` with clear naming

### TypeScript
- Strict mode enabled with no unused locals/parameters
- Use `satisfies` operator for type assertions
- Explicit null/undefined types where appropriate
- Interface/type naming: PascalCase (e.g., `Product`, `UserInput`)

### React & Components
- Functional components with hooks
- Forward refs for composable components
- Class Variance Authority (CVA) for component variants
- Radix UI primitives for accessibility
- HeroUI for design system components

### Data & State
- TanStack Query for server state
- Zustand for client state
- Supabase for API calls
- Query keys in separate `keys.ts` files
- Real-time subscriptions with custom hooks

### Naming Conventions
- Variables: camelCase (e.g., `productName`, `fetchProducts`)
- Components: PascalCase (e.g., `ProductTable`, `UserForm`)
- Types/Interfaces: PascalCase (e.g., `Product`, `Category`)
- Constants: UPPER_SNAKE_CASE (e.g., `PRODUCTS_QUERY_KEY`)
- Files: kebab-case for pages/components, camelCase for utilities

### Error Handling
- Throw errors from API functions for React Query to handle
- Use try/catch in mutations and async operations
- Proper error boundaries in React components

## Real-time System

The application has a sophisticated real-time system that automatically updates stock information across all relevant tables:

### Real-time Monitored Tables
1. `item_transaksi_pembelian` - Purchase items
2. `transaksi_pembelian` - Purchase transactions
3. `item_transaksi_penjualan` - Sales items
4. `transaksi_penjualan` - Sales transactions
5. `item_retur_pembelian` - Purchase return items
6. `retur_pembelian` - Purchase returns
7. `item_retur_penjualan` - Sales return items
8. `retur_penjualan` - Sales returns
9. `stock_opname_items` - Stock adjustment items
10. `stock_opname` - Stock adjustments
11. `produk` - Product master data

### Enhanced Real-time Hooks
- `useProductsWithRealtimeStocks()`: Combines product and stock data with real-time updates
- `useRealtimeQueryInvalidation()`: Generic invalidation for all queries
- `useRealtimeStockCache()`: Cached stock data with real-time updates

### Performance Improvements
- 5x faster real-time events (2→10 events per second)
- Better connection stability
- Proper resource cleanup to prevent memory leaks
- Debug logging for troubleshooting

## Testing
No test framework is currently configured in the project (as noted in CRUSH.md).

## Special Notes
- The application uses a custom theme built with Tailwind CSS and HeroUI
- Authentication is handled via Supabase
- The project implements a feature-rich POS system with real-time inventory updates
- The application follows modern React patterns with hooks and TypeScript
- Component organization follows a feature-based architecture