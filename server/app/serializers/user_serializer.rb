class UserSerializer
  include JSONAPI::Serializer

  attributes :id, :email, :name, :role, :phone

  attribute :address do |user|
    user.display_address
  end
end
