class Api::V1::UsersController < Api::V1::ApiController
  before_action :authenticate_user!

  def show_current
    render json: {
      user: UserSerializer.new(current_user).serializable_hash[:data][:attributes]
    }
  end
end
