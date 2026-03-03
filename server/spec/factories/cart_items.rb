FactoryBot.define do
  factory :cart_item do
    user
    product
    quantity { 1 }
  end
end
