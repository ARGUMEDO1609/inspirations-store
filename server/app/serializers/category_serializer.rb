class CategorySerializer
  include JSONAPI::Serializer
  attributes :id, :name, :slug
end
