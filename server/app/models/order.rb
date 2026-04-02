class Order < ApplicationRecord
  belongs_to :user
  has_many :order_items, dependent: :destroy
  has_many :addresses, as: :addressable, dependent: :destroy
  has_many :notes, as: :notable, dependent: :destroy

  enum :status, { pending: 0, paid: 1, shipped: 2, completed: 3, cancelled: 4 }
  enum :payment_method, { card: 0, cash_on_delivery: 1 }

   validates :total, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :shipping_address, presence: true

  after_commit :sync_shipping_address_from_legacy!, if: :saved_change_to_shipping_address?
  after_update_commit { broadcast_status_change }

  def self.ransackable_attributes(auth_object = nil)
    [ "created_at", "id", "payment_id", "payment_status", "status", "total", "updated_at", "user_id", "shipping_address", "payment_method" ]
  end

  def self.ransackable_associations(auth_object = nil)
    [ "user", "order_items", "addresses", "notes" ]
  end

  def shipping_address_record
    addresses.shipping.order(updated_at: :desc).first || addresses.order(updated_at: :desc).first
  end

  def display_shipping_address
    shipping_address_record&.legacy_text.presence || self[:shipping_address]
  end

  def sync_legacy_address_column_from_addresses!
    normalized = shipping_address_record&.legacy_text.presence
    update_column(:shipping_address, normalized) if self[:shipping_address] != normalized
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

  def sync_shipping_address_from_legacy!
    raw_address = self[:shipping_address].to_s.strip
    existing_address = addresses.shipping.order(updated_at: :desc).first

    if raw_address.blank?
      existing_address&.destroy
      return
    end

    if existing_address
      existing_address.update!(address_line_1: raw_address)
    else
      addresses.create!(address_type: :shipping, address_line_1: raw_address, city: "")
    end
  end

  def map_order_status(payment_status)
    normalized = payment_status.to_s.downcase

    case normalized
    when "approved", "aceptada", "aceptado"
      :paid
    when "pending", "pendiente", "in_process", "in_mediation"
      :pending
    when "rejected", "rechazada", "rechazado", "cancelled", "fallida", "fallido"
      :cancelled
    else
      status.to_sym
    end
  end

  def should_restore_stock?(previous_status, next_status)
    previous_status == "pending" && next_status == :cancelled
  end

  def restore_reserved_stock!
    order_items.includes(:product).find_each do |item|
      item.product.increment!(:stock, item.quantity)
    end
  end

  def broadcast_status_change
    ActionCable.server.broadcast("order_channel_#{user_id}", {
      type: "ORDER_STATUS_UPDATE",
      order_id: id,
      status: status
    })
  end
end
