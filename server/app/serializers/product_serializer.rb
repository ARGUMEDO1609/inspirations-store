class ProductSerializer
  include JSONAPI::Serializer
  attributes :id, :title, :description, :price, :stock, :slug, :category_id, :image_url

  belongs_to :category

  attribute :image_url do |product|
    if product.image.attached?
      Rails.application.routes.url_helpers.rails_storage_proxy_url(product.image, only_path: false)
    end
  end
end
