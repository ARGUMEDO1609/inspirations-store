# frozen_string_literal: true

class Rack::Attack
  ### Configure Cache ###
  Rack::Attack.cache.store = ActiveSupport::Cache::MemoryStore.new

  ### Throttle All Requests ###
  # Limit each IP to 100 requests per minute
  throttle("req/ip", limit: 100, period: 1.minute) do |req|
    req.ip unless req.path.start_with?("/assets")
  end

  ### Throttle Auth Endpoints ###
  # Limit login/signup to 5 requests per minute per IP
  throttle("auth/ip", limit: 5, period: 1.minute) do |req|
    if req.path.match?(%r{\A/(api/v1)?/(users/sign_in|users/sign_up|login|signup)})
      req.ip
    end
  end

  ### Throttle Cart/Checkout ###
  # Limit cart operations to 30 requests per minute per user
  throttle("cart/user", limit: 30, period: 1.minute) do |req|
    if req.path.match?(%r{\A/api/v1/cart}) && req.post?
      req.env["HTTP_AUTHORIZATION"]&.gsub("Bearer ", "")
    end
  end

  ### Block Suspicious Requests ###
  # Block requests with common attack patterns
  blocklist("block-bad-requests") do |req|
    Rack::Attack::Fail2Ban.filter("pentesters-#{req.ip}", maxretry: 3, findtime: 10.minutes, bantime: 1.hour) do
      CGI.unescape(req.query_string) =~ %r{/etc/passwd} ||
        req.path.include?("..") ||
        req.path.include?("wp-admin") ||
        req.path.include?("wp-login")
    end
  end

  ### Custom Response ###
  self.throttled_responder = lambda do |request|
    match_data = request.env["rack.attack.match_data"]
    now = Time.current

    headers = {
      "Content-Type" => "application/json",
      "Retry-After" => (match_data[:period] - (now.to_i % match_data[:period])).to_s
    }

    body = {
      success: false,
      error: "Demasiadas solicitudes. Intenta de nuevo en unos segundos.",
      error_code: "RATE_LIMITED"
    }

    [429, headers, [body.to_json]]
  end

  self.blocklisted_responder = lambda do |_request|
    body = {
      success: false,
      error: "Solicitud bloqueada.",
      error_code: "BLOCKED"
    }

    [403, { "Content-Type" => "application/json" }, [body.to_json]]
  end
end
