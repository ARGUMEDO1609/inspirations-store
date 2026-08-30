# frozen_string_literal: true

# Adds a correlation ID to every API request for distributed tracing.
# The ID is generated if not provided by the client via X-Request-Id header,
# and returned in the response header for log correlation.

module CorrelationId
  extend ActiveSupport::Concern

  included do
    before_action :set_correlation_id
  end

  private

  def set_correlation_id
    @correlation_id = request.headers["X-Request-Id"].presence || generate_correlation_id
    Thread.current[:correlation_id] = @correlation_id

    response.headers["X-Request-Id"] = @correlation_id
  end

  def generate_correlation_id
    SecureRandom.uuid
  end
end
