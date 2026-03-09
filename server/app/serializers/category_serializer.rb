class CategorySerializer
  include JSONAPI::Serializer
  attributes :id, :name, :slug, :description, :image_url

  attribute :image_url do |category|
    if category.image.attached?
      Rails.application.routes.url_helpers.rails_blob_url(category.image, only_path: false)
    end
  end
end
