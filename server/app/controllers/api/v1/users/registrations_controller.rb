class Api::V1::Users::RegistrationsController < Devise::RegistrationsController
  include ApiResponses

  respond_to :json
  skip_forgery_protection only: [ :create ]

  def create
    build_resource(sign_up_params)

    if resource.save
      sign_in(resource)

      render_success(
        data: UserSerializer.new(resource).serializable_hash[:data][:attributes],
        message: "Signed up successfully"
      )
    else
      render_error(
        "User could not be created",
        details: resource.errors.full_messages
      )
    end
  end

  private

  def sign_up_params
    params.require(:user).permit(:email, :password, :password_confirmation, :name, :address, :phone)
  end
end
