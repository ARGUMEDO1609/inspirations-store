FactoryBot.define do
  factory :variant do
    association :variantable, factory: :product
    name { "M" }
    variant_type { "size" }
    stock { 10 }
  end
end
