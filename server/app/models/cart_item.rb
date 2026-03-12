class CartItem < ApplicationRecord
  belongs_to :user
  belongs_to :product
  
  validates :quantity, presence: true, numericality: { greater_than: 0 }
  validate :validate_stock_availability

  def self.ransackable_attributes(auth_object = nil)
    ["created_at", "id", "product_id", "quantity", "updated_at", "user_id"]
  end

  def self.ransackable_associations(auth_object = nil)
    ["user", "product"]
  end

  private

  def validate_stock_availability
    return if product.nil? || quantity.nil?
    
    if quantity > product.stock
      errors.add(:quantity, "supera el stock disponible (#{product.stock})")
    end
  end
end
