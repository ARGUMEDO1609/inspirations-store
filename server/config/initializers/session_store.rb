# frozen_string_literal: true

# Cookie-based session store for the API (replaces JWT-in-localStorage).
#
# Security:
#   - HttpOnly:  JS cannot read the cookie (no XSS token theft).
#   - Secure:    sent only over HTTPS in production.
#   - SameSite:  :lax so the cookie is sent on top-level navigations and same-site
#                requests, but NOT on cross-site POSTs (CSRF mitigation).
#   - expire_after: 1 day to mirror the prior JWT expiration.
#
# For the SinglePage-App + API same-origin (or allowed cross-origin) flow, the
# browser automatically attaches this cookie to every fetch to the API when
# `withCredentials: true` is set on the client and CORS allows credentials.
Rails.application.config.session_store :cookie_store,
  key: "_inspirations_session",
  same_site: :lax,
  secure: Rails.env.production?,
  httponly: true,
  expire_after: 1.day
