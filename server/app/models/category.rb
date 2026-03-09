class Category < ApplicationRecord
  has_one_attached :image
  has_many :products, dependent: :destroy
  has_many :reviews, as: :reviewable, dependent: :destroy

  validates :name, presence: true, uniqueness: true
  validates :slug, presence: true, uniqueness: true

  before_validation :generate_slug, on: [ :create, :update ]

  def self.ransackable_attributes(auth_object = nil)
    [ "created_at", "description", "id", "name", "slug", "updated_at" ]
  end

  private

  def generate_slug
    self.slug = name.parameterize if name.present? && slug.blank?
  end
end
