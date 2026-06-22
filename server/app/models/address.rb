class Address < ApplicationRecord
  ADDRESSABLE_TYPES = %w[User Order].freeze

  belongs_to :addressable, polymorphic: true

  enum :address_type, { shipping: 0, billing: 1, home: 2 }

  validates :address_line_1, presence: true
  validates :addressable_type, inclusion: { in: ADDRESSABLE_TYPES }

  after_commit :sync_legacy_addressable_field, on: [ :create, :update, :destroy ]

  def self.ransackable_attributes(auth_object = nil)
    [ "address_line_1", "address_line_2", "address_type", "addressable_id", "addressable_type", "city", "country", "created_at", "id", "state", "zip_code" ]
  end

  def self.ransackable_associations(auth_object = nil)
    [ "addressable" ]
  end

  def full_text
    [ address_line_1, address_line_2, city, state, zip_code, country ].reject(&:blank?).join(", ")
  end

  def legacy_text
    parts = [ address_line_1, address_line_2, city, state, zip_code ].reject(&:blank?)
    parts << country if country.present? && country != "Colombia"
    parts.join(", ")
  end

  private

  def sync_legacy_addressable_field
    return unless addressable.respond_to?(:sync_legacy_address_column_from_addresses!)

    addressable.sync_legacy_address_column_from_addresses!
  end
end
