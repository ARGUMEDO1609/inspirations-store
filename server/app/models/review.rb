class Review < ApplicationRecord
  belongs_to :user
  belongs_to :reviewable, polymorphic: true

  validates :rating, presence: true, inclusion: { in: 1..5 }
  validates :comment, presence: true, length: { minimum: 5 }

  def self.ransackable_attributes(auth_object = nil)
    ["comment", "created_at", "id", "rating", "reviewable_id", "reviewable_type", "updated_at", "user_id"]
  end
end
