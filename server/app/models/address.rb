class Address < ApplicationRecord
  belongs_to :addressable, polymorphic: true

  enum :address_type, { shipping: 0, billing: 1, home: 2 }

  validates :address_line_1, :city, presence: true

  def self.ransackable_attributes(auth_object = nil)
    ["address_line_1", "address_line_2", "address_type", "addressable_id", "addressable_type", "city", "country", "created_at", "id", "state", "zip_code"]
  end

  def self.ransackable_associations(auth_object = nil)
    ["addressable"]
  end
end
