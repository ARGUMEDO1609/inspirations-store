# frozen_string_literal: true

Rails.application.config.action_dispatch.default_headers = {
  "X-Frame-Options" => "SAMEORIGIN",
  "X-Content-Type-Options" => "nosniff",
  "X-XSS-Protection" => "1; mode=block",
  "Referrer-Policy" => "strict-origin-when-cross-origin",
  "Permissions-Policy" => "camera=(), microphone=(), geolocation=()"
}
