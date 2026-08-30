# frozen_string_literal: true

module Api
  module V1
    class HealthController < ActionController::Base
      def show
        checks = {
          status: "ok",
          timestamp: Time.current.iso8601(3),
          rails: Rails.version,
          ruby: RUBY_VERSION,
          database: check_database
        }

        status_code = checks.values.all? { |v| v != "error" } ? :ok : :service_unavailable

        render json: checks, status: status_code
      rescue => e
        render json: { status: "error", error: e.message }, status: :service_unavailable
      end

      private

      def check_database
        ActiveRecord::Base.connection.execute("SELECT 1")
        "ok"
      rescue => e
        Rails.logger.error("Health check DB error: #{e.message}")
        "error"
      end
    end
  end
end
