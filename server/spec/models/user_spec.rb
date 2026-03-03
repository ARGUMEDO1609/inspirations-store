require 'rails_helper'

RSpec.describe User, type: :model do
  describe 'validations' do
    it { should validate_presence_of(:name) }
    it { should validate_presence_of(:email) }
    it { should validate_uniqueness_of(:email).case_insensitive }
  end

  describe 'associations' do
    it { should have_many(:orders) }
    it { should have_many(:cart_items) }
  end

  describe 'enum' do
    it { should define_enum_for(:role).with_values(customer: 0, admin: 1) }
  end

  describe 'factory' do
    it 'creates a valid user' do
      user = build(:user)
      expect(user).to be_valid
    end

    it 'creates an admin user' do
      user = build(:admin_user)
      expect(user).to be_valid
      expect(user.admin?).to be true
    end
  end
end
