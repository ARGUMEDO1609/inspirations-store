# frozen_string_literal: true

class Rack::Attack
  ### Configure Cache ###
  if Rails.env.test?
    Rack::Attack.cache.store = ActiveSupport::Cache::MemoryStore.new
  else
    Rack::Attack.cache.store = ActiveSupport::Cache::RedisCacheStore.new(
      url: ENV.fetch("REDIS_URL", "redis://localhost:6379/1"),
      pool_size: 5,
      pool_timeout: 5
    ) rescue ActiveSupport::Cache::MemoryStore.new
  end

  ### Safe IPs (never throttled) ###
  safelist("allow-localhost") { |req| req.ip == "127.0.0.1" || req.ip == "::1" }
  safelist("allow-health-checks") { |req| req.path == "/up" }

  ### Global Request Throttle ###
  throttle("req/ip", limit: 300, period: 1.minute) do |req|
    req.ip unless req.path.start_with?("/assets", "/packs", "/up")
  end

  ### Auth Endpoints - Stricter Limits ###
  throttle("auth/login/ip", limit: 5, period: 1.minute) do |req|
    if req.post? && req.path.match?(%r{\A/(api/v1)?/(users/sign_in|login)\z})
      req.ip
    end
  end

  throttle("auth/signup/ip", limit: 3, period: 10.minutes) do |req|
    if req.post? && req.path.match?(%r{\A/(api/v1)?/(users/sign_up|signup)\z})
      req.ip
    end
  end

  throttle("auth/password/ip", limit: 2, period: 15.minutes) do |req|
    if req.post? && req.path.match?(%r{\A/(api/v1)?/(users/password)\z})
      req.ip
    end
  end

  throttle("auth/otp/ip", limit: 5, period: 5.minutes) do |req|
    if req.post? && req.path.match?(%r{\A/(api/v1)?/(users/otp|2fa)\z})
      req.ip
    end
  end

  ### API Token Abuse ###
  throttle("api/token/ip", limit: 10, period: 1.minute) do |req|
    if req.path.start_with?("/api/v1") && req.env["HTTP_AUTHORIZATION"]&.start_with?("Bearer ")
      req.env["HTTP_AUTHORIZATION"].gsub("Bearer ", "")[0..20] + "-" + req.ip
    end
  end

  ### Cart & Checkout ###
  throttle("cart/user", limit: 30, period: 1.minute) do |req|
    if req.path.match?(%r{\A/api/v1/cart}) && %w[POST PATCH DELETE].include?(req.request_method)
      token = req.env["HTTP_AUTHORIZATION"]&.gsub("Bearer ", "")
      token ? token[0..20] + "-" + req.ip : req.ip
    end
  end

  throttle("checkout/ip", limit: 10, period: 5.minutes) do |req|
    if req.post? && req.path.match?(%r{\A/api/v1/(checkout|orders)\z})
      req.ip
    end
  end

  ### Payment Webhooks (separate limiter) ###
  throttle("webhook/wompi/ip", limit: 100, period: 1.minute) do |req|
    req.ip if req.path.match?(%r{\A/api/v1/webhooks/wompi})
  end

  ### Admin Panel ###
  throttle("admin/ip", limit: 60, period: 1.minute) do |req|
    req.ip if req.path.start_with?("/admin")
  end

  ### Block Suspicious Requests ###
  blocklist("block-bad-requests") do |req|
    Rack::Attack::Fail2Ban.filter("pentesters-#{req.ip}", maxretry: 5, findtime: 10.minutes, bantime: 1.hour) do
      body_match = false
      begin
        body_match = req.body.read(10000).match?(/union\s+select|select\s+.*\s+from|drop\s+table|insert\s+into|xp_cmdshell/i)
      ensure
        req.body.rewind
      end
      CGI.unescape(req.query_string.to_s) =~ %r{/etc/passwd} ||
        req.path.include?("..") ||
        req.path.match?(%r{\A/(wp-admin|wp-login|phpmyadmin|\.git|\.env)}) ||
        body_match
    end
  end

  ### Block Known Bad User-Agents ###
  blocklist("block-bad-agents") do |req|
    ua = req.user_agent.to_s.downcase
    %w[sqlmap nikto nessus hydra nmap masscan zgrab].any? { |bad| ua.include?(bad) }
  end

  ### Custom Responses ###
  self.throttled_responder = lambda do |request|
    match_data = request.env["rack.attack.match_data"]
    retry_after = match_data[:period] - (Time.current.to_i % match_data[:period])

    headers = {
      "Content-Type" => "application/json",
      "Retry-After" => retry_after.to_s,
      "X-RateLimit-Limit" => match_data[:limit].to_s,
      "X-RateLimit-Remaining" => "0",
      "X-RateLimit-Reset" => (Time.current.to_i + retry_after).to_s
    }

    body = {
      success: false,
      error: "Demasiadas solicitudes. Intenta de nuevo en #{retry_after} segundos.",
      error_code: "RATE_LIMITED",
      retry_after: retry_after
    }

    [ 429, headers, [ body.to_json ] ]
  end

  self.blocklisted_responder = lambda do |_request|
    body = {
      success: false,
      error: "Solicitud bloqueada por seguridad.",
      error_code: "BLOCKED"
    }

    [ 403, { "Content-Type" => "application/json" }, [ body.to_json ] ]
  end
end
