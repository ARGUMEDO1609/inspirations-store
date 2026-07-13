# Inspiration Store - Project Task Board

## Project Overview

**Inspiration Store** - E-commerce monorepo with React frontend and Rails API backend.

```
inspiration-store/
├── house/                 # Frontend: React + Vite + Tailwind
├── server/                # Backend: Rails 8 API + PostgreSQL
├── bin/                   # Shared scripts (dev, setup, ci)
├── docs/                  # Technical documentation
└── legacy/root_rails_app/ # Archived old Rails app
```

**Stack:**
- **Frontend:** React 19, Vite 8, Tailwind CSS 4, React Router 7, Framer Motion, Axios, Action Cable client
- **Backend:** Rails 8.1, PostgreSQL, Devise + JWT, Pundit, ActiveAdmin, Action Cable, Active Storage, Wompi payments
- **Testing:** RSpec, FactoryBot, Shoulda Matchers
- **CI:** bin/ci runs rubocop, brakeman, rspec, eslint, vite build

---

## Current Status

✅ **Core e-commerce flow works:** Catalog → Auth → Cart → Order → Payment → Webhook → Order status sync  
✅ **Monorepo reorganized:** Clean separation between `house/` and `server/`  
✅ **Real-time:** Action Cable for cart, orders, and product notifications  
✅ **Admin:** ActiveAdmin with order management, products, categories, users  
✅ **Payments:** Wompi integration (checkout session + webhook validation)  
✅ **Polymorphic associations:** Reviews, Notes, Addresses on User/Order/Product  
✅ **All tests passing:** 116 RSpec examples, 0 failures  
✅ **CI green:** rubocop, brakeman, rspec, eslint, vite build

---

## Completed Features

### Catalog & Navigation
- [x] Product listing with categories filter and search
- [x] Product detail page with variants (size)
- [x] Framer Motion animations on gallery and product cards
- [x] Responsive Tailwind UI with custom design system

### Authentication & User
- [x] Signup / Login with JWT (Devise + devise-jwt)
- [x] Token revocation on logout (JwtDenylist)
- [x] Current user endpoint with auto-refresh
- [x] Profile page with editable name, phone, address
- [x] Auth test coverage: signup, login, current_user, logout

### Cart & Orders
- [x] Add/remove/update quantities in cart
- [x] Stock validation on add to cart and checkout
- [x] Create order from cart (reserves stock)
- [x] Order history with status badges
- [x] Stock restoration when pending order cancelled
- [x] Real-time cart sync via Action Cable (multi-tab)

### Payments (Wompi)
- [x] Checkout session creation (`Wompi::CheckoutBuilder`)
- [x] Webhook signature validation (`Wompi::WebhookValidator`)
- [x] Webhook handler: approved/pending/declined/voided
- [x] Payment status sync → order state machine
- [x] PaymentResult pages: success / failure / pending
- [x] Fake mode for local development (`WOMPI_FAKE_MODE=true`)

### Real-time (Action Cable)
- [x] StoreChannel: product create notifications
- [x] OrderChannel: order status updates
- [x] CartChannel: cross-tab cart synchronization
- [x] Frontend connection management with auth

### Admin (ActiveAdmin)
- [x] Products CRUD with image upload (Active Storage)
- [x] Categories CRUD
- [x] Users management
- [x] Orders with state transitions: paid → shipped → completed
- [x] Reviews, Notes, Addresses as polymorphic resources
- [x] Ransack filters and scopes

### Architecture & Maintenance
- [x] Monorepo structure with shared bin scripts
- [x] API response helpers (`ApiResponses` concern)
- [x] Pundit policies for all resources
- [x] JSONAPI serializers
- [x] Rack::Attack rate limiting
- [x] Security headers middleware

---

## Active Work / In Progress

### Testing Improvements
- [ ] Run `bin/ci` as standard pre-push gate
- [ ] Add request specs for CartItems edge cases (empty cart, variant stock)
- [ ] Add mutation tests for order state machine
- [ ] E2E smoke test: full checkout flow with fake Wompi

### Frontend Polish
- [ ] Optimize bundle size (516KB JS gzipped → consider code splitting)
- [ ] Add React Error Boundaries for graceful degradation
- [ ] Improve loading skeletons on Gallery/ProductDetail
- [ ] Accessibility audit (ARIA labels, focus management)

### Backend Hardening
- [ ] Add database indexes for common queries (orders by user+status, cart_items by user)
- [ ] Implement idempotency keys on webhook processing
- [ ] Add request logging correlation IDs
- [ ] Review and tune Rack::Attack thresholds for production

---

## Phase Roadmap

### Phase 1 - Production Readiness (2-3 weeks)
**Goal:** Deployable to staging with confidence

| Task | Status | Notes |
|------|--------|-------|
| Environment configs (staging/production) | ⬜ | `.env.production` templates in `server/.env.example` |
| Database migration strategy | ✅ | `rails db:migrate` works clean |
| Asset compilation (ActiveAdmin CSS) | ✅ | `npm run build:css` in server/ |
| Health check endpoint | ⬜ | `/up` exists, add custom `/health` |
| Structured logging (JSON) | ⬜ | Replace default Rails logger |
| Error tracking (Sentry/Honeybadger) | ⬜ | |
| CDN for Active Storage | ⬜ | Configure CloudFront/S3 |
| SSL/TLS termination | ⬜ | Handled by platform (Heroku/Railway/Render) |

### Phase 2 - Operational Excellence (ongoing)
**Goal:** Reduce manual ops, improve observability

| Task | Status | Notes |
|------|--------|-------|
| Admin dashboard metrics (orders/day, revenue) | ⬜ | ActiveAdmin dashboard customization |
| Automated stock alerts | ⬜ | Sidekiq cron + ActionMailer |
| Order export (CSV/Excel) | ⬜ | ActiveAdmin batch action |
| Customer communication templates | ⬜ | Order confirmation, shipped, delivered |
| Refund flow (admin-initiated) | ⬜ | Wompi void + stock restore |

### Phase 3 - Growth Features (backlog)
**Goal:** Business value additions

| Feature | Status | Notes |
|---------|--------|-------|
| Wishlist / favorites | ⬜ | New polymorphic `Favorite` model |
| Product reviews (public) | ✅ | Model exists, needs frontend |
| Discount codes / coupons | ⬜ | New `Promotion` model + checkout integration |
| Guest checkout | ⬜ | Optional email capture, link to account later |
| Email marketing integration | ⬜ | MailerLite / Brevo webhook |
| Analytics events (GA4/PostHog) | ⬜ | Frontend event layer + backend sync |

---

## Known Technical Debt

| Area | Issue | Priority |
|------|-------|----------|
| **Frontend bundle** | 516KB gzipped single chunk | Medium - code split by route |
| **CartContext** | setState in useEffect warnings (eslint disabled) | Low - refactor to useReducer |
| **Wompi fake mode** | Hardcoded test keys in checkout_builder | Low - use env vars only |
| **Order serializer** | N+1 on order_items → product | Medium - add `includes` in controller |
| **Action Cable** | No connection recovery logging | Low - add reconnect attempts counter |
| **Admin CSS** | Tailwind + ActiveAdmin asset pipeline friction | Medium - consider ViewComponent migration |

---

## Commands Reference

```bash
# Setup (run once)
bin/setup

# Development (runs both)
bin/dev

# Backend only
cd server && bin/rails s

# Frontend only
cd house && npm run dev

# Full CI locally
bin/ci

# Backend tests
cd server && bundle exec rspec

# Backend lint + security
cd server && bundle exec rubocop && bundle exec brakeman

# Frontend lint + build
cd house && npm run lint && npm run build

# Database
cd server && rails db:migrate && rails db:seed

# Deploy frontend
bin/thrust  # → Vercel
```

---

## Environment Variables

### Backend (`server/.env`)
```bash
# Required
DATABASE_URL=postgresql://...
DEVISE_JWT_SECRET_KEY=...
WOMPI_PUBLIC_KEY=pub_...
WOMPI_INTEGRITY_KEY=...
WOMPI_EVENT_SECRET=...
WOMPI_FAKE_MODE=true  # local dev

# Optional
FRONTEND_URL=http://localhost:5173
RAILS_LOG_LEVEL=debug
```

### Frontend (`house/.env`)
```bash
VITE_API_URL=http://localhost:3000
```

---

## Documentation References

- `docs/DEPLOYMENT.md` - Production deployment checklist
- `docs/api-validation-and-errors.md` - API error codes and validation rules
- `AGENTS.md` - Repository guidelines for AI agents
- `README.md` - Project overview and quick start

---

*Last updated: 2025-07-13*
*All CI checks passing: rspec (116), rubocop, brakeman, eslint, vite build*