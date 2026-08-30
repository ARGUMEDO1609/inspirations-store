class Api::V1::ApiController < ActionController::API
  include ActionController::Cookies
  include ActionController::RequestForgeryProtection
  include Pundit::Authorization
  include ApiResponses
  include CorrelationId
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

  # Auth flow: Warden session user (set by Devise via the HttpOnly cookie).
  def authenticate_user!
    return if current_user.present?

    user = warden_user
    if user
      @current_user = user
      return
    end

    render_unauthorized
  end

  def current_user
    return @current_user if @current_user.present?

    @current_user = warden_user
  end

  def warden_user
    request&.env && request.env["warden"]&.user(:api_v1_user)
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
