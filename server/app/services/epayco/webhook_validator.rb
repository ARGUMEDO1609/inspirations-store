require "digest"

module Epayco
  class WebhookValidator
    class << self
      def valid_signature?(params)
        return false unless params.present?

        expected = expected_signature(params)
        provided = params[:x_signature].to_s
        return false if expected.blank? || provided.blank?

        ActiveSupport::SecurityUtils.secure_compare(provided, expected)
      rescue KeyError => e
        Rails.logger.warn("ePayco signature missing configuration: #{e.message}")
        false
      end

      private

      def expected_signature(params)
        values = [
          customer_id,
          private_key,
          params[:x_ref_payco],
          params[:x_transaction_id],
          params[:x_amount],
          params[:x_currency_code]
        ].map(&:to_s)

        Digest::SHA256.hexdigest(values.join("^"))
      end

      def customer_id
        ENV.fetch("EPAYCO_P_CUST_ID")
      end

      def private_key
        ENV.fetch("EPAYCO_P_KEY")
      end
    end
  end
end
