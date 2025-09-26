# Build Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production (includes TypeScript compilation)  
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build
- No test framework currently configured

# Code Style Guidelines

## Imports & Structure
- Use path aliases: `@/*` for src imports
- Feature-based organization: `src/features/{feature-name}/{api,hooks,components,queries}`
- Type definitions in `src/types/` with clear naming

## TypeScript
- Strict mode enabled with no unused locals/parameters
- Use `satisfies` operator for type assertions
- Explicit null/undefined types where appropriate
- Interface/type naming: PascalCase (e.g., `Product`, `UserInput`)

## React & Components
- Functional components with hooks
- Forward refs for composable components
- Class Variance Authority (CVA) for component variants
- Radix UI primitives for accessibility
- HeroUI for design system components

## Data & State
- TanStack Query for server state
- Zustand for client state
- Supabase for API calls
- Query keys in separate `keys.ts` files
- Real-time subscriptions with custom hooks

## Naming Conventions
- Variables: camelCase (e.g., `productName`, `fetchProducts`)
- Components: PascalCase (e.g., `ProductTable`, `UserForm`)
- Types/Interfaces: PascalCase (e.g., `Product`, `Category`)
- Constants: UPPER_SNAKE_CASE (e.g., `PRODUCTS_QUERY_KEY`)
- Files: kebab-case for pages/components, camelCase for utilities

## Error Handling
- Throw errors from API functions for React Query to handle
- Use try/catch in mutations and async operations
- Proper error boundaries in React components