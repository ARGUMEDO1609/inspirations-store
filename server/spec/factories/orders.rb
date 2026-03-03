FactoryBot.define do
  factory :order do
    user
    total { 100.00 }
    shipping_address { "123 Test Street" }
    status { :pending }
  end
end
