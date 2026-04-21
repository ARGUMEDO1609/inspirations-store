class Review < ApplicationRecord
  REVIEWABLE_TYPES = %w[Product Category].freeze

  belongs_to :user
  belongs_to :reviewable, polymorphic: true

  validates :rating, presence: true, inclusion: { in: 1..5 }
  validates :comment, presence: true, length: { minimum: 5 }
  validates :reviewable_type, inclusion: { in: REVIEWABLE_TYPES }

  def self.ransackable_attributes(auth_object = nil)
    [ "comment", "created_at", "id", "rating", "reviewable_id", "reviewable_type", "updated_at", "user_id" ]
  end

  def self.ransackable_associations(auth_object = nil)
    [ "user", "reviewable" ]
  end
end
