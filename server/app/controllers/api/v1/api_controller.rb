class Api::V1::ApiController < ActionController::API
  include ActionController::Cookies
  include ActionController::RequestForgeryProtection
  include Pundit::Authorization
  include ApiResponses
  # CSRF: this is a JSON API called cross-origin from the SPA. We skip Rails
  # form CSRF protection intentionally: the cookie session is SameSite=:lax
  # (blocks cross-site POST), CORS only allows the configured frontend origins
  # (Rack::Cors rejects foreign sites), and there is no HTML rendering on this
  # namespace that would benefit from token-based CSRF. Foreign origins cannot
  # read or create state because no credentials are accepted when CORS rejects
  # them. The admin panel (ActiveAdmin) lives on a separate controller and
  # continues to use Rails CSRF protection normally.
  skip_forgery_protection

  before_action :set_active_storage_url_options

  rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized

  private

  # Auth flow:
  #   1. Look for a Warden session user (set by Devise via the HttpOnly cookie).
  #   2. Fall back to a short-lived WebSocket bearer token from /cable_token
  #      (single-use, signed, 60s) so ActionCable can authenticate cross-origin.
  #   3. As a last resort, accept the legacy Authorization: Bearer header used by
  #      tests during migration.
  def authenticate_user!
    return if current_user.present?

    user = warden_user
    user ||= begin
      token = extract_token_from_header
      token.present? ? User.find_for_jwt_authentication_from_token(token) : nil
    end

    if user
      @current_user = user
      return
    end

    render_unauthorized
  end

  def extract_token_from_header
    header = request.headers["Authorization"]
    return nil unless header.present?

    header.split(" ").last if header.start_with?("Bearer ")
  end

  def current_user
    return @current_user if @current_user.present?

    @current_user = warden_user
  end

  def warden_user
    request&.env && request.env["warden"]&.user
  end

  def user_not_authorized
    render_forbidden
  end

  def set_active_storage_url_options
    return unless defined?(ActiveStorage::Current)

    ActiveStorage::Current.url_options = {
      protocol: request.protocol,
      host: request.host,
      port: request.port
    }
  end
end
