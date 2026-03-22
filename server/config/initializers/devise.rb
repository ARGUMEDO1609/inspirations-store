# frozen_string_literal: true

Devise.setup do |config|
  config.mailer_sender = 'please-change-me@at-example.com'

  require 'devise/orm/active_record'

  config.case_insensitive_keys = [:email]
  config.strip_whitespace_keys = [:email]
  config.email_regexp = /\A[^@\s]+@[^@\s]+\z/
  config.reset_password_within = 6.hours
  config.sign_out_via = :delete
  config.navigational_formats = [:html, :json]
  config.authentication_keys = [:email]
  config.case_insensitive_keys = [:email]
  config.strip_whitespace_keys = [:email]
  config.skip_session_storage = [:http_auth]


  # JWT Configuration
  config.jwt do |jwt|
    jwt.secret = ENV['DEVISE_JWT_SECRET_KEY'] || 'temporary_secret_for_development_1234567890'
    jwt.dispatch_requests = [
      ['POST', %r{/login$}],
      ['POST', %r{/signup$}]
    ]
    jwt.revocation_requests = [
      ['DELETE', %r{/logout$}]
    ]
    jwt.expiration_time = 1.day.to_i
  end
end
