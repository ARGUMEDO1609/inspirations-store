require "digest"
require "json"

module Wompi
  class WebhookValidator
    class << self
      def valid?(body:, headers:)
        payload = parse_payload(body)
        signature = payload["signature"]
        return false unless signature

        provided_checksum = checksum_from_headers(headers) || signature["checksum"]
        return false if provided_checksum.blank?

        timestamp = signature["timestamp"].to_s
        secret = ENV.fetch("WOMPI_EVENT_SECRET")
        expected_checksum = Digest::SHA256.hexdigest(
          "#{concatenate_properties(signature["properties"], payload["data"])}#{timestamp}#{secret}"
        )

        expected_checksum.length == provided_checksum.to_s.length &&
          ActiveSupport::SecurityUtils.secure_compare(provided_checksum.to_s, expected_checksum)
      rescue JSON::ParserError
        false
      end

      private

      def parse_payload(raw_body)
        return {} unless raw_body.present?
        JSON.parse(raw_body)
      end

      def checksum_from_headers(headers)
        headers["X-Event-Checksum"].presence || headers["HTTP_X_EVENT_CHECKSUM"].presence
      end

      def concatenate_properties(properties, data)
        return "" unless properties.is_a?(Array) && data.is_a?(Hash)

        properties.map do |property|
          value_for_property(data, property)
        end.join
      end

      def value_for_property(data, property)
        property.to_s.split('.').reduce(data) do |current, key|
          current.is_a?(Hash) ? current[key] : nil
        end.to_s
      end
    end
  end
end
