class ProductSerializer
  include JSONAPI::Serializer
  attributes :id, :title, :description, :price, :stock, :image, :slug, :category_id
  
  belongs_to :category
end
