FactoryBot.define do
  factory :product do
    sequence(:title) { |n| "Product #{n}" }
    description { "A test product description" }
    price { 100.00 }
    stock { 10 }
    category
  end
end
