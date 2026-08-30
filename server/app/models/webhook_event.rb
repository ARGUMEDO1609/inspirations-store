class WebhookEvent < ApplicationRecord
  validates :provider, :event_key, :processed_at, presence: true
  validates :event_key, uniqueness: { scope: :provider }

  def self.claim(provider:, event_key:)
    create!(provider: provider, event_key: event_key, processed_at: Time.current)
    true
  rescue ActiveRecord::RecordInvalid
    false
  end

  def self.release(provider:, event_key:)
    where(provider: provider, event_key: event_key).delete_all
  end
end
