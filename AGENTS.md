# Repository Guidelines

## Project Structure
- `house/`: React + Vite + Tailwind frontend
- `server/`: Rails 8 API backend (API only, no views)
- `legacy/root_rails_app/`: archived; do not add new features there

## Developer Commands

Run from repository root unless noted:
- `bin/setup`: install deps, prepare DB, install packages for both apps (run first)
- `bin/dev`: start both services via `Procfile.dev` (house Vite + server Rails on `:3000`)
- `bin/ci`: run `bundle exec rspec`, rubocop, `npm run lint`, `npm run build`

### Backend
- `cd server && bundle exec rspec` — all tests
- `cd server && bundle exec rspec SPEC_PATH:LINE_NUMBER` — single example
- `cd server && bin/rubocop -a` — auto-correct style
- `cd server && rails db:migrate && rails db:seed` — prepare DB

### Frontend
- `cd house && npm run dev` — dev server
- `cd house && npm run lint -- --fix` — auto-fix lint
- `cd house && npm run build` — production build

### Deployment
- `bin/thrust` — deploy frontend to Vercel

## Environment Variables
- Backend: set in `server/.env` (copy from `server/.env.example`)
- Frontend: Vite vars must use `VITE_` prefix (e.g., `VITE_API_URL`)
- Never commit `.env` files

## Payment Setup
- Uses Wompi for payments
- Set `WOMPI_FAKE_MODE=true` for local dev without real keys
- Required: `WOMPI_PUBLIC_KEY`, `WOMPI_INTEGRITY_KEY`, `WOMPI_EVENT_SECRET`

## API Notes
- API base: `/api/v1`
- Standard error format: `{ success: false, error: "...", error_code: "...", details: [...] }`
- Use `ApiResponses` helpers (`render_success`, `render_error`, `render_validation_errors`)

## Key Files
- `docs/DEPLOYMENT.md`: production deployment checklist
- `docs/api-validation-and-errors.md`: API error codes and model validations
- `TASKS.md`: project board and status
