# frozen_string_literal: true

Devise.setup do |config|
  config.mailer_sender = ENV.fetch("MAILER_FROM", "no-reply@inspirationstore.co")

  require "devise/orm/active_record"

  config.case_insensitive_keys = [ :email ]
  config.strip_whitespace_keys = [ :email ]
  config.email_regexp = /\A[^@\s]+@[^@\s]+\z/
  config.reset_password_within = 6.hours
  config.sign_out_via = :delete
  config.navigational_formats = [ :html, :json ]
  config.authentication_keys = [ :email ]

  # Authentication now uses a HttpOnly+Secure+SameSite cookie session (see
  # config/initializers/session_store.rb). Do NOT skip session storage for
  # :http_auth/JSON — that was the old devise-jwt behavior that prevented
  # Warden from persisting the user and the cookie from being set.
  config.skip_session_storage = []
end
