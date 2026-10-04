# Repository Guidelines

## Project layout

- `house/` is the React, Vite, and Tailwind storefront.
- `server/` is the Rails 8 API and ActiveAdmin backend.
- `legacy/root_rails_app/` is archived. Do not add features there.
- `docs/` contains API, deployment, and project documentation.

## Local development

Run commands from the repository root unless a directory is shown.

- `bin/setup` installs backend and frontend dependencies, prepares the database,
  and starts the development services. Use `bin/setup --skip-server` to prepare
  without starting them.
- `bin/dev` runs Vite and Rails together. If dependencies and the database are
  already prepared, this is the usual start command.
- The frontend runs on `http://localhost:5173`; the API runs on port `3000`.
- Backend settings belong in `server/.env` (start from
  `server/.env.example`). Frontend Vite settings belong in `house/.env` and must
  use the `VITE_` prefix, such as `VITE_API_URL`.
- Never commit `.env` files, credentials, or production secrets.

### Backend commands

- `cd server && bundle exec rspec` runs the backend specs.
- `cd server && bundle exec rspec SPEC_PATH:LINE_NUMBER` runs one example.
- `cd server && bin/rubocop -a` applies RuboCop corrections.
- `cd server && bin/rails db:prepare` creates or migrates the development DB.
- `cd server && bin/rails db:seed` loads seed data.
- `cd server && npm run build:css` builds ActiveAdmin styles.

Development uses the individual `DATABASE_HOST`, `DATABASE_USERNAME`,
`DATABASE_PASSWORD`, and `DATABASE_NAME` settings. Production requires
`DATABASE_URL`. PostgreSQL must be running before database tasks or API requests
can succeed.

### Frontend commands

- `cd house && npm run dev` starts Vite by itself.
- `cd house && npm run lint` checks frontend lint rules.
- `cd house && npm run lint -- --fix` applies safe lint fixes.
- `cd house && npm run build` builds the production frontend.

### CI and deployment

- `bin/ci` runs backend specs, RuboCop, frontend lint, and the frontend build.
- `bin/thrust` deploys the frontend to Vercel.
- Follow the provider-specific deployment guide in `docs/` for backend setup.

## Application conventions

- The API base path is `/api/v1`.
- Use `ApiResponses` helpers: `render_success`, `render_error`, and
  `render_validation_errors`.
- Keep API errors in the documented shape:
  `{ success: false, error: "...", error_code: "...", details: [...] }`.
- Payments use Wompi. Local development can use `WOMPI_FAKE_MODE=true`; never
  enable fake mode in production.
- Production requires `WOMPI_PUBLIC_KEY`, `WOMPI_INTEGRITY_KEY`, and
  `WOMPI_EVENT_SECRET`.

## Useful references

- `TASKS.md` is the project board and status list.
- `docs/api-validation-and-errors.md` documents API errors and validations.
- `docs/DEPLOYMENT.md` and other files under `docs/` document deployment.
