class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :jwt_authenticatable, jwt_revocation_strategy: JwtDenylist

  enum :role, { customer: 0, admin: 1 }

  has_many :cart_items
  has_many :reviews, dependent: :destroy
  has_many :addresses, as: :addressable, dependent: :destroy
  has_many :notes, as: :notable, dependent: :destroy

  validates :name, presence: true

  def self.find_for_jwt_authentication(sub)
    find_by(id: sub)
  end

  def self.find_for_jwt_authentication_from_token(token)
    secret = ENV["DEVISE_JWT_SECRET_KEY"] || "temporary_secret_for_development_1234567890"

    begin
      decoded = JWT.decode(token, secret, true, algorithm: "HS256")
      payload = decoded[0]
      user_id = payload["sub"]
      jti = payload["jti"]

      return nil if JwtDenylist.exists?(jti: jti)

      find_by(id: user_id) if user_id
    rescue JWT::DecodeError
      nil
    end
  end

  def self.ransackable_attributes(auth_object = nil)
    [ "created_at", "email", "id", "name", "role", "updated_at" ]
  end

  def self.ransackable_associations(auth_object = nil)
    [ "cart_items", "orders" ]
  end
end
