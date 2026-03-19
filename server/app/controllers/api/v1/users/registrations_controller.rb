class Api::V1::Users::RegistrationsController < Devise::RegistrationsController
  respond_to :json
  skip_forgery_protection only: [ :create ]

  def create
    build_resource(sign_up_params)

    if resource.save
      sign_in(resource)

      render json: {
        status: { code: 200, message: "Signed up successfully." },
        data: UserSerializer.new(resource).serializable_hash[:data][:attributes]
      }, status: :ok
    else
      render json: {
        status: { message: "User couldn't be created successfully. #{resource.errors.full_messages.to_sentence}" }
      }, status: :unprocessable_entity
    end
  end

  private

  def sign_up_params
    params.require(:user).permit(:email, :password, :password_confirmation, :name, :address, :phone)
  end
end
