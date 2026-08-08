# frozen_string_literal: true

# Be sure to restart your server when you modify this file.

# Avoid CORS issues when API is called from the frontend app.
# Handle Cross-Origin Resource Sharing (CORS) in order to accept cross-origin Ajax requests.

# Read more: https://github.com/cyu/rack-cors

# Allowed origins come from CORS_ORIGINS (comma-separated) or FRONTEND_URL,
# falling back to the local Vite dev server. This keeps the frontend URL
# configurable per environment (Docker dev, production, etc.).
allowed_origins =
  if Rails.env.production?
    ENV.fetch("CORS_ORIGINS").split(",").map(&:strip).reject(&:blank?)
  else
    ENV["CORS_ORIGINS"].presence&.split(",")&.map(&:strip) ||
      [ ENV["FRONTEND_URL"].presence, "http://localhost:5173", "http://127.0.0.1:5173" ].compact
  end

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins(*allowed_origins)

    resource "*",
      headers: :any,
      credentials: true,
      methods: [ :get, :post, :put, :patch, :delete, :options, :head ]
  end
end
