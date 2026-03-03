class Product < ApplicationRecord
  belongs_to :category
  has_many :order_items
  has_many :cart_items

  validates :title, presence: true
  validates :price, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :stock, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  validates :slug, presence: true, uniqueness: true

  before_validation :generate_slug, on: :create

  def self.ransackable_attributes(auth_object = nil)
    [ "category_id", "created_at", "description", "id", "price", "stock", "title", "updated_at" ]
  end

  def self.ransackable_associations(auth_object = nil)
    [ "cart_items", "category", "order_items" ]
  end

  private

  def generate_slug
    self.slug = title.parameterize if title.present? && slug.blank?
  end
end
