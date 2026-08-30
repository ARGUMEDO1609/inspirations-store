# frozen_string_literal: true

# Structured JSON logging for production.
# In development/test, keeps the default human-readable format.

if Rails.env.production?
  Rails.application.configure do
    log_formatter = proc do |severity, datetime, _progname, msg|
      correlation_id = Thread.current[:correlation_id]
      {
        level: severity,
        time: datetime.iso8601(3),
        correlation_id: correlation_id,
        msg: msg.respond_to?(:dump) ? msg : msg.to_s
      }.to_json + "\n"
    end

    json_logger = ActiveSupport::Logger.new(STDOUT, formatter: log_formatter)
    config.logger = ActiveSupport::TaggedLogging.new(json_logger)
    config.log_tags = [ :request_id ]

    # Middleware to add request context to logs
    config.log_tags.push(
      ->(request) { "remote:#{request.remote_ip}" },
      ->(request) { "method:#{request.request_method}" },
      ->(request) { "path:#{request.path}" }
    )
  end
end
