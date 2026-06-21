class Api::V1::ApiController < ActionController::API
  include Pundit::Authorization
  include ApiResponses

  before_action :set_active_storage_url_options

  rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized

  private

  def authenticate_user!
    return if current_user.present?

    warden_user = request&.env && request.env["warden"]&.user
    if warden_user.present?
      @current_user = warden_user
      return
    end

    token = extract_token_from_header

    if token.present?
      user = User.find_for_jwt_authentication_from_token(token)
      if user.present?
        @current_user = user
        return
      end
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

    @current_user = request&.env && request.env["warden"]&.user
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
