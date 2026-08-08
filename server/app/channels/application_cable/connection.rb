require "jwt"

module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user

    def connect
      self.current_user = find_verified_user
    end

    private

    def find_verified_user
      token = token_from_request
      return reject_unauthorized_connection if token.blank?

      user_id = verify_ws_token(token)
      user = User.find_by(id: user_id)
      user || reject_unauthorized_connection
    end

    def verify_ws_token(token)
      payload, = JWT.decode(
        token,
        Rails.application.secret_key_base,
        true,
        algorithm: "HS256"
      )
      payload["sub"]
    rescue JWT::ExpiredSignature, JWT::DecodeError
      nil
    end

    # The browser cannot set custom headers on WebSocket upgrades, so the SPA
    # passes the short-lived token acquired from POST /cable_token through the
    # Sec-WebSocket-Protocol subprotocol (`Bearer.<token>`), which is not
    # logged in access logs and not leaked via Referer.
    def token_from_request
      subprotocols = request.headers["Sec-WebSocket-Protocol"].to_s.split(",").map(&:strip)
      bearer = subprotocols.find { |p| p.start_with?("Bearer.") }
      bearer ? bearer.sub("Bearer.", "") : request.params[:token]
    end
  end
end
