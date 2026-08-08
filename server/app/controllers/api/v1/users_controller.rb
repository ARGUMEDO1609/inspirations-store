class Api::V1::UsersController < Api::V1::ApiController
  before_action :authenticate_user!, except: :show_current

  def show_current
    # Keep accepting the legacy bearer token while clients finish moving to
    # cookie sessions. Visitors without either credential receive an empty
    # session below.
    authenticate_user! if request.headers["Authorization"].present?
    return if performed?

    # Session discovery is intentionally public: visitors use this endpoint
    # when Home loads, and no active session is a normal state rather than an
    # authorization failure. Mutating profile requests remain authenticated.
    if current_user
      render_success(data: UserSerializer.new(current_user).serializable_hash[:data])
    else
      render json: { success: true, data: nil }, status: :ok
    end
  end

  def update
    if current_user.update(user_params)
      render_success(data: UserSerializer.new(current_user).serializable_hash[:data], message: "Profile updated successfully")
    else
      render_error(current_user.errors.full_messages.first)
    end
  end

  private

  def user_params
    params.require(:user).permit(:name, :address, :phone)
  end
end
