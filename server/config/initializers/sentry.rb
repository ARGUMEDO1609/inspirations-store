# frozen_string_literal: true

Sentry.init do |config|
  config.dsn = ENV["SENTRY_DSN"]
  config.breadcrumbs_logger = [ :active_support_logger, :http_logger ]

  config.enabled_environments = %w[ production ]
  config.traces_sample_rate = 0.2
  config.profiles_sample_rate = 0.1

  config.send_default_pii = false

  config.before_send = lambda do |event, _hint|
    event.tags[:rails_env] = Rails.env
    event
  end
end
