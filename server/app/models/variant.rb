class Variant < ApplicationRecord
  VARIANT_TYPES = %w[size color material].freeze

  belongs_to :variantable, polymorphic: true

  validates :name, presence: true
  validates :variant_type, inclusion: { in: VARIANT_TYPES }, presence: true
  validates :stock, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true

  def self.ransackable_attributes(auth_object = nil)
    [ "created_at", "id", "name", "stock", "updated_at", "variant_type", "variantable_type" ]
  end

  def self.ransackable_associations(auth_object = nil)
    [ "variantable" ]
  end
end
