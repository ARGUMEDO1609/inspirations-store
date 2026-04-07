require "digest"

module Wompi
  class CheckoutBuilder
    class Error < StandardError; end

    def self.build(order:, frontend_url:)
      new(order, frontend_url).build
    end

    def initialize(order, frontend_url)
      @order = order
      @frontend_url = frontend_url
    end

    def build
      return fake_payload if fake_mode?

      {
        reference: reference,
        order_id: order.id,
        amount_in_cents: amount_in_cents,
        currency: currency,
        public_key: public_key,
        signature: signature,
        redirect_url: redirect_url
      }
    rescue StandardError => e
      raise Error, e.message
    end

    private

    attr_reader :order, :frontend_url

    def reference
      "order-#{order.id}"
    end

    def amount_in_cents
      (order.total * 100).round(0).to_i
    end

    def currency
      ENV.fetch("WOMPI_CURRENCY", "COP")
    end

    def public_key
      env!("WOMPI_PUBLIC_KEY")
    end

    def integrity_key
      env!("WOMPI_INTEGRITY_KEY")
    end

    def signature
      Digest::SHA256.hexdigest("#{reference}#{amount_in_cents}#{currency}#{integrity_key}")
    end

    def redirect_url
      "#{normalized_frontend_url}/payment/result"
    end

    def normalized_frontend_url
      frontend_url.to_s.chomp("/")
    end

    def fake_payload
      Rails.logger.info("Wompi fake mode enabled, returning stub checkout payload") if defined?(Rails)

      stub_currency = ENV.fetch("WOMPI_FAKE_CURRENCY", currency)
      stub_public_key = ENV.fetch("WOMPI_FAKE_PUBLIC_KEY", "pk_test_stub")
      stub_integrity_key = ENV.fetch("WOMPI_FAKE_INTEGRITY_KEY", "fake_integrity_key")

      {
        reference: reference,
        order_id: order.id,
        amount_in_cents: amount_in_cents,
        currency: stub_currency,
        public_key: stub_public_key,
        signature: Digest::SHA256.hexdigest("#{reference}#{amount_in_cents}#{stub_currency}#{stub_integrity_key}"),
        redirect_url: redirect_url,
        fake: true
      }
    end

    def fake_mode?
      ENV["WOMPI_FAKE_MODE"] == "true"
    end

    def env!(key)
      ENV.fetch(key)
    rescue KeyError => e
      raise Error, "#{key} debe estar configurada para Wompi checkout (#{e.message})"
    end
  end
end
