class CartItem < ApplicationRecord
  belongs_to :user
  belongs_to :product
  
  validates :quantity, presence: true, numericality: { greater_than: 0 }

  def self.ransackable_attributes(auth_object = nil)
    ["created_at", "id", "product_id", "quantity", "updated_at", "user_id"]
  end

  def self.ransackable_associations(auth_object = nil)
    ["user", "product"]
  end
end
