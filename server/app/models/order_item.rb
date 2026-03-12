class OrderItem < ApplicationRecord
  belongs_to :order
  belongs_to :product
  
  validates :quantity, presence: true, numericality: { greater_than: 0 }
  validates :unit_price, presence: true

  def self.ransackable_attributes(auth_object = nil)
    ["created_at", "id", "order_id", "product_id", "quantity", "unit_price", "updated_at"]
  end

  def self.ransackable_associations(auth_object = nil)
    ["order", "product"]
  end
end
