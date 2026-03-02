class UserSerializer
  include JSONAPI::Serializer
  attributes :id, :email, :name, :role, :address, :phone
end
