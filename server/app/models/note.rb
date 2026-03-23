class Note < ApplicationRecord
  NOTABLE_TYPES = %w[User Product Order].freeze

  belongs_to :notable, polymorphic: true
  belongs_to :admin_user

  validates :body, presence: true
  validates :notable_type, inclusion: { in: NOTABLE_TYPES }

  def self.ransackable_attributes(auth_object = nil)
    ['body', 'created_at', 'id', 'notable_id', 'notable_type', 'updated_at']
  end

  def self.ransackable_associations(auth_object = nil)
    ['notable', 'admin_user']
  end
end
