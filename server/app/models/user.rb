class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  enum :role, { customer: 0, admin: 1 }

  has_many :cart_items
  has_many :orders, dependent: :destroy
  has_many :reviews, dependent: :destroy
  has_many :addresses, as: :addressable, dependent: :destroy
  has_many :notes, as: :notable, dependent: :destroy

  validates :name, presence: true

  after_commit :sync_primary_address_from_legacy!, if: :saved_change_to_address?

  # Devise-jwt is no longer registered as a Warden strategy (the API now uses a
  # HttpOnly cookie session). We keep this decoder helper for two reasons:
  # (1) the legacy Bearer token is still accepted by ApiController as a last
  #     resort during the migration window;
  # (2) the request specs forge tokens with ENV["DEVISE_JWT_SECRET_KEY"].
  # It will be removed once both sides move off the bearer token.
  def self.find_for_jwt_authentication_from_token(token)
    secret = ENV.fetch("DEVISE_JWT_SECRET_KEY")

    begin
      decoded = JWT.decode(token, secret, true, algorithm: "HS256")
      payload = decoded[0]
      user_id = payload["sub"]
      jti = payload["jti"]

      return nil if JwtDenylist.exists?(jti: jti)

      find_by(id: user_id) if user_id
    rescue JWT::DecodeError
      nil
    end
  end

  def self.ransackable_attributes(auth_object = nil)
    [ "created_at", "email", "id", "name", "role", "updated_at" ]
  end

  def self.ransackable_associations(auth_object = nil)
    [ "cart_items", "orders" ]
  end

  def primary_address_record
    addresses.home.order(updated_at: :desc).first || addresses.order(updated_at: :desc).first
  end

  def display_address
    primary_address_record&.legacy_text.presence || self[:address]
  end

  def sync_legacy_address_column_from_addresses!
    normalized = primary_address_record&.legacy_text.presence
    update_column(:address, normalized) if self[:address] != normalized
  end

  private

  def sync_primary_address_from_legacy!
    raw_address = self[:address].to_s.strip
    existing_address = addresses.home.order(updated_at: :desc).first

    if raw_address.blank?
      existing_address&.destroy
      return
    end

    if existing_address
      existing_address.update!(address_line_1: raw_address)
    else
      addresses.create!(address_type: :home, address_line_1: raw_address, city: "")
    end
  end
end
