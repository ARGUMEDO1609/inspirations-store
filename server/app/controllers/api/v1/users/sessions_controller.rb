class Api::V1::Users::SessionsController < Devise::SessionsController
  include ApiResponses

  respond_to :json
  skip_forgery_protection only: [ :create, :destroy ]

  def create
    self.resource = User.find_for_database_authentication(email: sign_in_params[:email])

    if resource && resource.valid_password?(sign_in_params[:password])
      sign_in(resource_name, resource)
      yield resource if block_given?

      render_success(
        data: UserSerializer.new(resource).serializable_hash[:data][:attributes],
        message: "Logged in successfully"
      )
    else
      render_unauthorized("Invalid email or password")
    end
  end

  def destroy
    signed_out = (Devise.sign_out_all_scopes ? sign_out : sign_out(resource_name))

    if signed_out
      render_success(message: "Logged out successfully")
    else
      render_unauthorized("No active session found")
    end
  end

  protected

  def sign_in_params
    params.require(:user).permit(:email, :password)
  end
end
