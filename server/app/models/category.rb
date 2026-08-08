class Category < ApplicationRecord
  has_one_attached :image
  has_many :products, dependent: :destroy
  has_many :reviews, as: :reviewable, dependent: :destroy

  validates :name, presence: true, uniqueness: true

  validate :acceptable_image

  after_create_commit  { broadcast_change("create") }
  after_update_commit  { broadcast_change("update") }
  after_destroy_commit { broadcast_change("destroy") }

  def self.ransackable_attributes(auth_object = nil)
    [ "created_at", "description", "id", "name", "updated_at" ]
  end

  private

  def acceptable_image
    return unless image.attached?

    unless image.content_type.in?(%w[image/jpeg image/png image/webp])
      errors.add(:image, "debe ser JPEG, PNG o WebP")
    end

    if image.byte_size > 5.megabytes
      errors.add(:image, "es demasiado grande (máx. 5 MB)")
    end
  end

  def broadcast_change(action)
    ActionCable.server.broadcast("store_channel", {
      type: "CATEGORY_CHANGE",
      action: action,
      category: CategorySerializer.new(self).serializable_hash[:data]
    })
  end
end
