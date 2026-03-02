class User < ApplicationRecord
  # Devise modules
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :jwt_authenticatable, jwt_revocation_strategy: JwtDenylist

  enum :role, { customer: 0, admin: 1 }

  has_many :orders
  has_many :cart_items, dependent: :destroy

  validates :name, presence: true
end
