class Product < ApplicationRecord
  belongs_to :category
  has_one_attached :image
  has_many :order_items
  has_many :cart_items
  has_many :reviews, as: :reviewable, dependent: :destroy
  has_many :notes, as: :notable, dependent: :destroy

  validates :title, presence: true
  validates :price, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :stock, numericality: { only_integer: true, greater_than_or_equal_to: 0 }

  after_create_commit  { broadcast_change("create") }
  after_update_commit  { broadcast_change("update") }
  after_destroy_commit { broadcast_change("destroy") }

  def self.ransackable_attributes(auth_object = nil)
    [ "category_id", "created_at", "description", "id", "price", "stock", "title", "updated_at" ]
  end

  def self.ransackable_associations(auth_object = nil)
    [ "cart_items", "category", "order_items" ]
  end

  private

  def broadcast_change(action)
    ActionCable.server.broadcast("store_channel", {
      type: "PRODUCT_CHANGE",
      action: action,
      product: ProductSerializer.new(self).serializable_hash[:data]
    })
  end
end
