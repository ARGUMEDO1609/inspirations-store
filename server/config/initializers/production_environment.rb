# frozen_string_literal: true

# Fail closed instead of starting an internet-facing application with local
# defaults, a disabled payment integration, or no shared rate-limit store.
if Rails.env.production?

required_variables = %w[
  APP_HOST
  FRONTEND_URL
  BACKEND_URL
  CORS_ORIGINS
  REDIS_URL
  DEVISE_JWT_SECRET_KEY
  WOMPI_PUBLIC_KEY
  WOMPI_INTEGRITY_KEY
  WOMPI_EVENT_SECRET
  SERVER_DATABASE_PASSWORD
].freeze

missing_variables = required_variables.select { |name| ENV[name].to_s.strip.empty? }
if missing_variables.any?
  raise "Missing required production environment variables: #{missing_variables.join(', ')}"
end

raise "WOMPI_FAKE_MODE must be false in production" if ENV["WOMPI_FAKE_MODE"] == "true"

%w[FRONTEND_URL BACKEND_URL].each do |name|
  uri = URI.parse(ENV.fetch(name))
  unless uri.is_a?(URI::HTTPS) && uri.host.present?
    raise "#{name} must be an absolute HTTPS URL in production"
  end
end

invalid_origins = ENV.fetch("CORS_ORIGINS").split(",").map(&:strip).reject do |origin|
  uri = URI.parse(origin)
  uri.is_a?(URI::HTTPS) && uri.host.present?
rescue URI::InvalidURIError
  false
end
raise "CORS_ORIGINS must contain only absolute HTTPS origins" if invalid_origins.any?
end
