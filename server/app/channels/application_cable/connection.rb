module ApplicationCable
  class Connection < ActionCable::Connection::Base
  identified_by :current_user

  def connect
    self.current_user = find_verified_user
  end

  private

  def find_verified_user
    token = request.params[:token]
    if token.present?
      user = User.find_for_jwt_authentication_from_token(token)
      if user.present?
        return user
      end
    end
    reject_unauthorized_connection
  end

end
