class Order < ApplicationRecord
  belongs_to :user
  has_many :order_items, dependent: :destroy

  enum :status, { pending: 0, paid: 1, shipped: 2, completed: 3, cancelled: 4 }

  validates :total, presence: true
  validates :shipping_address, presence: true

  after_update_commit { broadcast_status_change }

  def self.ransackable_attributes(auth_object = nil)
    ['created_at', 'id', 'payment_id', 'payment_status', 'status', 'total', 'updated_at', 'user_id', 'shipping_address']
  end

  def self.ransackable_associations(auth_object = nil)
    ['user', 'order_items']
  end

  def apply_payment_update!(payment_id:, payment_status:)
    with_lock do
      previous_status = status
      next_status = map_order_status(payment_status)

      restore_reserved_stock! if should_restore_stock?(previous_status, next_status)

      update!(
        payment_id: payment_id.presence || self.payment_id,
        payment_status: payment_status,
        status: next_status
      )
    end
  end

  private

  def map_order_status(payment_status)
    case payment_status
    when 'approved'
      :paid
    when 'pending', 'in_process', 'in_mediation'
      :pending
    when 'rejected', 'cancelled'
      :cancelled
    else
      status.to_sym
    end
  end

  def should_restore_stock?(previous_status, next_status)
    previous_status == 'pending' && next_status == :cancelled
  end

  def restore_reserved_stock!
    order_items.includes(:product).find_each do |item|
      item.product.increment!(:stock, item.quantity)
    end
  end

  def broadcast_status_change
    ActionCable.server.broadcast("order_channel_#{user_id}", {
      type: 'ORDER_STATUS_UPDATE',
      order_id: id,
      status: status
    })
  end
end
