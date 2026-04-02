require "base64"
require "json"
require "net/http"
require "uri"

module Epayco
  class SessionCreator
    class Error < StandardError; end

    LOGIN_URL = URI("https://apify.epayco.co/login").freeze
    SESSION_URL = URI("https://apify.epayco.co/payment/session/create").freeze

    def self.create_session!(order:, frontend_url:, backend_url:)
      new(order, frontend_url, backend_url).create_session!
    end

    def initialize(order, frontend_url, backend_url)
      @order = order
      @frontend_url = frontend_url
      @backend_url = backend_url
    end

    def create_session!
      token = fetch_apify_token!
      payload = build_payload
      response = request_session(token, payload)
      session = response.dig("data")

      unless session.present? && session["sessionId"].present?
        raise Error, "Invalid session payload returned by ePayco"
      end

      {
        session_id: session["sessionId"],
        raw: session,
        amount: formatted_amount,
        currency: currency
      }
    rescue StandardError => e
      raise Error, e.message
    end

    private

    attr_reader :order, :frontend_url, :backend_url

    def fetch_apify_token!
      request = Net::HTTP::Post.new(LOGIN_URL)
      request["Content-Type"] = "application/json"
      request["Authorization"] = "Basic #{basic_auth_header}"

      response = Net::HTTP.start(LOGIN_URL.hostname, LOGIN_URL.port, use_ssl: true) do |http|
        http.request(request)
      end

      payload = parse_json(response.body)
      token = payload["token"]
      raise Error, payload["message"] || "ePayco token request failed" unless token.present?

      token
    end

    def request_session(token, payload)
      request = Net::HTTP::Post.new(SESSION_URL)
      request["Content-Type"] = "application/json"
      request["Authorization"] = "Bearer #{token}"
      request.body = payload.to_json

      response = Net::HTTP.start(SESSION_URL.hostname, SESSION_URL.port, use_ssl: true) do |http|
        http.request(request)
      end

      parsed = parse_json(response.body)
      unless parsed["success"]
        raise Error, parsed["textResponse"] || "ePayco session creation failed"
      end

      parsed
    end

    def parse_json(body)
      return {} unless body.present?
      JSON.parse(body)
    rescue JSON::ParserError
      {}
    end

    def build_payload
      {
        checkout_version: "2",
        name: store_name,
        currency: currency,
        amount: formatted_amount,
        lang: language,
        country: country,
        invoice: order.id.to_s,
        description: order_description,
        response: "#{normalized_frontend_url}/payment/result",
        confirmation: "#{normalized_backend_url}/api/v1/webhooks/epayco"
      }
    end

    def formatted_amount
      order.total.to_f.round(2)
    end

    def store_name
      ENV.fetch("EPAYCO_STORE_NAME", "Inspiration Store")
    end

    def currency
      ENV.fetch("EPAYCO_CURRENCY", "COP")
    end

    def country
      ENV.fetch("EPAYCO_COUNTRY", "CO")
    end

    def language
      ENV.fetch("EPAYCO_LANG", "ES")
    end

    def order_description
      items = order.order_items.limit(3).map do |item|
        "#{item.quantity}x #{item.product.title}"
      end
      [
        "Orden #{order.id}",
        items.join(" · ")
      ].reject(&:blank?).join(" — ")
    end

    def normalized_frontend_url
      frontend_url.to_s.chomp("/")
    end

    def normalized_backend_url
      backend_url.to_s.chomp("/")
    end

    def basic_auth_header
      public_key = ENV.fetch("EPAYCO_PUBLIC_KEY")
      private_key = ENV.fetch("EPAYCO_PRIVATE_KEY")
      Base64.strict_encode64("#{public_key}:#{private_key}")
    end
  end
end
