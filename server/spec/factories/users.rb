FactoryBot.define do
  factory :user do
    sequence(:email) { |n| "user#{n}@example.com" }
    name { "Test User" }
    password { "password123" }
    password_confirmation { "password123" }
    role { :customer }
  end

  factory :admin_user, parent: :user do
    role { :admin }
    email { "admin@example.com" }
  end
end
