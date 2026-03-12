class Order < ApplicationRecord
  belongs_to :user
  has_many :order_items, dependent: :destroy
  
  enum :status, { pending: 0, paid: 1, shipped: 2, completed: 3, cancelled: 4 }
  
  validates :total, presence: true
  validates :shipping_address, presence: true

  def self.ransackable_attributes(auth_object = nil)
    ["created_at", "id", "status", "total", "updated_at", "user_id", "shipping_address"]
  end

  def self.ransackable_associations(auth_object = nil)
    ["user", "order_items"]
  end
end
