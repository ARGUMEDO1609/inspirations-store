class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :jwt_authenticatable, jwt_revocation_strategy: JwtDenylist

  enum :role, { customer: 0, admin: 1 }

  has_many :orders
  has_many :cart_items, dependent: :destroy

  validates :name, presence: true

  def self.ransackable_attributes(auth_object = nil)
    [ "created_at", "email", "id", "name", "role", "updated_at" ]
  end
end
