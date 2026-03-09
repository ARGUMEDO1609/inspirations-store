class Note < ApplicationRecord
  belongs_to :notable, polymorphic: true
  belongs_to :admin_user

  validates :body, presence: true

  def self.ransackable_attributes(auth_object = nil)
    ["body", "created_at", "id", "updated_at"]
  end
end
