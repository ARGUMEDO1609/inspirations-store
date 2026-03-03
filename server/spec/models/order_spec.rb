require 'rails_helper'

RSpec.describe Order, type: :model do
  describe 'validations' do
    it { should validate_presence_of(:total) }
    it { should validate_presence_of(:shipping_address) }
  end

  describe 'associations' do
    it { should belong_to(:user) }
    it { should have_many(:order_items).dependent(:destroy) }
  end

  describe 'enum' do
    it { should define_enum_for(:status).with_values(pending: 0, paid: 1, shipped: 2, completed: 3, cancelled: 4) }
  end

  describe 'factory' do
    it 'creates a valid order' do
      order = build(:order)
      expect(order).to be_valid
    end
  end
end
