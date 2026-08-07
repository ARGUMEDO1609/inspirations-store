class ProductSerializer
  include JSONAPI::Serializer
  attributes :id, :title, :description, :price, :stock, :category_id, :image_url, :model_url, :variants, :has_variants

  belongs_to :category

  attribute :image_url do |product|
    if product.image.attached?
      Rails.application.routes.url_helpers.rails_storage_proxy_url(product.image, only_path: false)
    end
  end

  attribute :model_url do |product|
    if product.model_url.attached?
      Rails.application.routes.url_helpers.rails_blob_url(product.model_url, only_path: false)
    end
  end

  attribute :variants do |product|
    product.variants.map do |variant|
      {
        id: variant.id,
        name: variant.name,
        variant_type: variant.variant_type,
        stock: variant.stock
      }
    end
  end

  attribute :has_variants do |product|
    product.has_variants?
  end
end
