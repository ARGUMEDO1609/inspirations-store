class Order < ApplicationRecord
  belongs_to :user
  has_many :order_items, dependent: :destroy
  
  enum :status, { pending: 0, paid: 1, shipped: 2, completed: 3, cancelled: 4 }
  
  validates :total, presence: true
  validates :shipping_address, presence: true

  after_update_commit { broadcast_status_change }
  
  def self.ransackable_attributes(auth_object = nil)
    ["created_at", "id", "status", "total", "updated_at", "user_id", "shipping_address"]
  end

  def self.ransackable_associations(auth_object = nil)
    ["user", "order_items"]
  end

  private

  def broadcast_status_change
    ActionCable.server.broadcast("order_channel_#{user_id}", {
      type: "ORDER_STATUS_UPDATE",
      order_id: id,
      status: status
    })
  end

end
