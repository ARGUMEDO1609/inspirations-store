require "uri"
require "digest"

module Wompi
  class WebCheckoutUrl
    class Error < StandardError; end

    BASE_URL = "https://checkout.wompi.co/p/".freeze

    def self.build(order:, frontend_url:)
      new(order: order, frontend_url: frontend_url).build
    end

    def initialize(order:, frontend_url:)
      @order = order
      @frontend_url = frontend_url
    end

    def build
      "#{BASE_URL}?#{query_string}"
    rescue KeyError => e
      raise Error, "Wompi checkout configuration missing: #{e.message}"
    end

    private

    attr_reader :order, :frontend_url

    def query_string
      params = {
        "public-key" => public_key,
        "currency" => currency,
        "amount-in-cents" => amount_in_cents,
        "reference" => reference,
        "signature:integrity" => integrity_signature
      }
      
      # Wompi's AWS WAF blocks 'localhost' in URLs to prevent SSRF
      params["redirect-url"] = redirect_url unless redirect_url.include?("localhost")
      
      URI.encode_www_form(params)
    end

    def public_key
      fetch_env!("WOMPI_PUBLIC_KEY").strip
    end

    def currency
      ENV.fetch("WOMPI_CURRENCY", "COP").strip
    end

    def amount_in_cents
      (order.total.to_d * 100).round(0).to_i
    end

    def reference
      order.reference
    end

    def integrity_key
      fetch_env!("WOMPI_INTEGRITY_KEY").strip
    end

    def integrity_signature
      Digest::SHA256.hexdigest("#{reference}#{amount_in_cents}#{currency}#{integrity_key}")
    end

    def redirect_url
      "#{frontend_url.to_s.chomp('/')}/payment/result"
    end

    def fetch_env!(key)
      ENV.fetch(key)
    end
  end
end
