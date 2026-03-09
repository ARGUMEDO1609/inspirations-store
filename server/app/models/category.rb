class Category < ApplicationRecord
  has_one_attached :image
  has_many :products, dependent: :destroy
  has_many :reviews, as: :reviewable, dependent: :destroy

  validates :name, presence: true, uniqueness: true
  validates :slug, presence: true, uniqueness: true

  before_validation :generate_slug, on: [ :create, :update ]

  after_create_commit  { broadcast_change("create") }
  after_update_commit  { broadcast_change("update") }
  after_destroy_commit { broadcast_change("destroy") }

  def self.ransackable_attributes(auth_object = nil)
    [ "created_at", "description", "id", "name", "slug", "updated_at" ]
  end

  private

  def broadcast_change(action)
    ActionCable.server.broadcast("store_channel", {
      type: "CATEGORY_CHANGE",
      action: action,
      category: CategorySerializer.new(self).serializable_hash[:data]
    })
  end

  def generate_slug
    self.slug = name.parameterize if name.present? && slug.blank?
  end
end
