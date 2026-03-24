class Api::V1::UsersController < Api::V1::ApiController
  before_action :authenticate_user!

  def show_current
    render_success(data: UserSerializer.new(current_user).serializable_hash[:data][:attributes])
  end

  def update
    if current_user.update(user_params)
      render_success(data: UserSerializer.new(current_user).serializable_hash[:data][:attributes], message: "Profile updated successfully")
    else
      render_error(current_user.errors.full_messages.first)
    end
  end

  private

  def user_params
    params.require(:user).permit(:name, :address, :phone)
  end
end
