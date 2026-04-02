# Repository Guidelines

## Project Structure & Module Organization
This is an active monorepo with two working apps:
- `house/`: React + Vite frontend (`src/pages`, `src/components`, `src/api`, `src/context`, `src/hooks`).
- `server/`: Rails 8 API/backend (`app/`, `config/`, `db/`, `spec/`).

Root `bin/*` scripts orchestrate both apps. Treat `legacy/root_rails_app/` as archived reference only; do not add new features there.

## Build, Test, and Development Commands
Run from repository root unless noted:
- `bin/setup`: installs backend gems, prepares DB, installs frontend packages.
- `bin/dev`: starts both services via `Procfile.dev` (`house` Vite + `server` Rails on `:3000`).
- `bin/ci`: runs backend CI checks and frontend lint/build.

### Backend (Rails) Commands
- `cd server && bundle exec rspec` (run all backend tests)
- `cd server && bundle exec rspec SPEC_PATH` (run specific test file)
- `cd server && bundle exec rspec SPEC_PATH:LINE_NUMBER` (run specific test example)
- `cd server && bundle exec rspec --tag focus` (run focused tests)
- `cd server && bin/rubocop` (Ruby style check)
- `cd server && bin/rubocop -a` (auto-correct RuboCop offenses)
- `cd server && bin/brakeman --no-pager` (security scan)
- `cd server && bin/bundler-audit` (dependency vulnerability check)
- `cd server && rails db:migrate` (run database migrations)
- `cd server && rails db:rollback` (rollback last migration)
- `cd server && rails db:reset` (reset database)
- `cd server && rails console` (start Rails console)
- `cd server && rails routes` (list all routes)
- `cd server && rails db:seed` (seed database)
- `cd server && rails test:system` (run system tests)

### Frontend (Vite/React) Commands
- `cd house && npm run dev` (frontend dev server)
- `cd house && npm run lint` (ESLint)
- `cd house && npm run lint -- --fix` (ESLint with auto-fix)
- `cd house && npm run build` (production build)
- `cd house && npm run preview` (preview production build)
- `cd house && npm run test` (frontend tests - when configured)

### Deployment
- `bin/thrust`: deploy frontend to Vercel

## Coding Style & Naming Conventions

### Ruby/Rails
- Follows `rubocop-rails-omakase` (`server/.rubocop.yml`)
- Keep idiomatic Rails naming (`app/models/product.rb`, plural controllers, snake_case methods/files)
- Use `fetch` or `safe navigation` (`&.`) for nil protection
- Prefer `find_or_create_by` over manual existence checks
- Use scopes for reusable query logic
- Keep controllers skinny; move business logic to models or service objects
- Use `before_action` for common controller setup
- Strong parameters in controllers for mass assignment protection
- Use `enum` for status fields with clear integer values
- Avoid putting logic in views; use helpers or presenters instead
- Use `pluck` for selecting specific columns from database
- Use `exists?` instead of `count > 0` for existence checks
- Use `present?` and `blank?` for nil/empty checks (ActiveSupport extensions)

### JavaScript/React
Frontend linting uses `house/eslint.config.js` (ESLint + React Hooks/Refresh). Use:
- PascalCase for React components/files (`ProductCard.jsx`)
- `useX` naming for hooks (`useApiError.js`)
- 2-space indentation and existing quote/style patterns in touched files
- Prefer `const` and `let` over `var`
- Use arrow functions for concise callbacks
- Destructure objects and arrays when appropriate
- Use template literals for string interpolation
- Import ordering: React, third-party libraries, internal components, styles, types
- Named imports before default imports
- Avoid `any` type in TypeScript; use specific types or `unknown`
- Handle errors explicitly with try/catch or proper promise rejection handling
- Use functional components over class components
- Keep components small and focused (single responsibility principle)
- Use custom hooks for reusable logic
- Avoid inline styles; use CSS classes or styled-components when needed
- Follow accessibility guidelines (WCAG) for all UI components
- Use meaningful alt text for images
- Ensure proper color contrast ratios
- Use React.memo for expensive component re-renders
- Use useCallback and useMemo for performance optimization
- Properly clean up subscriptions and timers in useEffect

## Testing Guidelines

### Backend (RSpec)
Primary backend tests are RSpec under `server/spec`, with `*_spec.rb` naming and factories in `server/spec/factories`.

RSpec testing conventions:
- Use `describe` for test suites, `it` for test examples
- Use `context` to describe different scenarios within a test suite
- Use `let` and `let!` for memoized test data (use `let!` when data needs to be created before each test)
- Use `before` and `after` hooks for setup/teardown
- Use `subject` to define the object being tested
- Use `expect` for assertions with matchers like `to eq`, `to be_truthy`, `to include`, etc.
- Use `allow` and `receive` for mocking/stubbing with RSpec mocks
- Use FactoryBot factories for test data creation
- Test controller actions with HTTP verbs (`get`, `post`, `put`, `patch`, `delete`)
- Test both success and error cases
- Test authorization and authentication when applicable
- Use JSON parsing for API responses: `JSON.parse(response.body)`
- Test database interactions when necessary, but prefer mocking external services
- Follow the AAA pattern: Arrange, Act, Assert
- Write descriptive test names that explain what and why
- Keep tests focused on a single behavior
- Use shared examples for common test patterns
- Tag slow tests appropriately
- Use `be_*` matchers for boolean values (`be_truthy`, `be_falsy`, `be_nil`)
- Use `change` matcher to test side effects: `expect { action }.to change(Model, :count).by(1)`
- Use `receive` to test method calls: `expect(obj).to receive(:method).with(args).and_return(value)`

### Frontend Testing
- No frontend test runner is configured in CI yet
- At minimum ensure `npm run lint` and `npm run build` pass for frontend changes
- Consider adding Jest or Vitest for unit testing React components
- Use React Testing Library for component testing when tests are added
- Test component rendering with various props
- Test user interactions and event handlers
- Test data fetching and state updates
- Mock API calls in tests
- Test accessibility with axe-core or similar tools
- When adding tests, follow AAA pattern (Arrange, Act, Assert)
- Test edge cases and error conditions
- Use jest.mock or vitest.mock for mocking modules

## Commit & Pull Request Guidelines
Recent history follows Conventional Commit style (for example: `feat(frontend): ...`, `fix(admin): ...`, `docs(tasks): ...`). Prefer:
- `type(scope): short imperative summary`
- scopes aligned to subsystems (`frontend`, `admin`, `models`, `docs`, `repo`)
- types: `feat` (feature), `fix` (bug fix), `docs` (documentation), `style` (formatting), `refactor` (code restructuring), `test` (adding tests), `chore` (maintenance), `perf` (performance improvement)

PRs should include:
- Concise description of changes
- Linked issue/task when available
- Screenshots for UI changes
- API examples for backend behavior changes
- Description of how to test the changes
- Merge only after CI is green
- Keep PRs focused on a single concern
- Update documentation when changing functionality
- Follow the project's coding standards
- Ensure all tests pass before submitting
- Address all review comments before merging

## Security & Configuration Tips
Copy `server/.env.example` to `server/.env` for local setup. Never commit secrets (`DEVISE_JWT_SECRET_KEY`, `EPAYCO_PUBLIC_KEY`, `EPAYCO_PRIVATE_KEY`, `EPAYCO_P_CUST_ID`, `EPAYCO_P_KEY`, DB credentials).

Environment variables:
- Backend: Set in `.env` file following `.env.example` format
- Frontend: Vite environment variables prefixed with `VITE_` in `.env` file
- Never commit `.env` files to version control
- Use `rails credentials:edit` for sensitive credentials in Rails

Database:
- Uses PostgreSQL in development and production
- Schema managed through Rails migrations in `db/migrate`
- Seed data in `db/seeds.rb`
- Run `rails db:setup` to create database, load schema, and seed data
- Use migrations for schema changes, never edit schema.rb directly
- Keep migrations focused and reversible
- Use strong parameters in controllers for mass assignment protection
- Implement proper authentication and authorization
- Validate and sanitize all user inputs
- Use HTTPS in production
- Implement rate limiting for API endpoints
- Regularly update dependencies to patch security vulnerabilities
