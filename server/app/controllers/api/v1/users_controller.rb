class Api::V1::UsersController < ActionController::API
  include Pundit::Authorization

  rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized

  before_action :authenticate_user!

  def show_current
    render json: {
      data: UserSerializer.new(current_user).serializable_hash[:data][:attributes]
    }
  end

  def update
    if current_user.update(user_params)
      render json: {
        data: UserSerializer.new(current_user).serializable_hash[:data][:attributes],
        message: "Perfil actualizado con éxito"
      }
    else
      render json: { error: current_user.errors.full_messages.first }, status: :unprocessable_entity
    end
  end

  private

  def authenticate_user!
    token = extract_token_from_header

    if token.present?
      user = User.find_for_jwt_authentication_from_token(token)
      if user.present?
        @current_user = user
        return
      end
    end

    render json: { error: "Unauthorized" }, status: :unauthorized
  end

  def extract_token_from_header
    header = request.headers["Authorization"]
    return nil unless header.present?

    header.split(" ").last if header.start_with?("Bearer ")
  end

  def current_user
    @current_user
  end

  def user_not_authorized
    render json: { error: "You are not authorized to perform this action." }, status: :forbidden
  end

  def user_params
    params.require(:user).permit(:name, :address, :phone)
  end
end
