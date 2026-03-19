class Api::V1::Users::SessionsController < Devise::SessionsController
  respond_to :json
  skip_forgery_protection only: [ :create, :destroy ]

  def create
    self.resource = User.find_for_database_authentication(email: sign_in_params[:email])

    if resource && resource.valid_password?(sign_in_params[:password])
      sign_in(resource_name, resource)
      yield resource if block_given?

      render json: {
        status: { code: 200, message: "Logged in successfully." },
        data: UserSerializer.new(resource).serializable_hash[:data][:attributes]
      }, status: :ok
    else
      render json: { error: "Email o contraseña inválidos" }, status: :unauthorized
    end
  end

  def destroy
    signed_out = (Devise.sign_out_all_scopes ? sign_out : sign_out(resource_name))

    if signed_out
      render json: {
        status: 200,
        message: "Logged out successfully."
      }, status: :ok
    else
      render json: {
        status: 401,
        message: "Couldn't find an active session."
      }, status: :unauthorized
    end
  end

  protected

  def sign_in_params
    params.require(:user).permit(:email, :password)
  end
end
