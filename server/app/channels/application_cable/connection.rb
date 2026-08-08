module ApplicationCable
  class Connection < ActionCable::Connection::Base
  identified_by :current_user

  def connect
    self.current_user = find_verified_user
  end

  private

  def find_verified_user
    token = token_from_request
    if token.present?
      user = User.find_for_jwt_authentication_from_token(token)
      if user.present?
        return user
      end
    end
    reject_unauthorized_connection
  end

  def token_from_request
    # Prefer the Sec-WebSocket-Protocol subprotocol (`Bearer.<token>`) over the
    # legacy `?token=` query param. The query param leaks into access logs and
    # Referer headers; the subprotocol field does not. Kept the fallback for
    # backward compatibility with any older clients.
    subprotocols = request.headers["Sec-WebSocket-Protocol"].to_s.split(",").map(&:strip)
    bearer = subprotocols.find { |p| p.start_with?("Bearer.") }
    if bearer
      bearer.sub("Bearer.", "")
    else
      request.params[:token]
    end
  end
  end
end
