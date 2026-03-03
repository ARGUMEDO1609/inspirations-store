require 'rails_helper'

RSpec.describe CartItem, type: :model do
  describe 'validations' do
    it 'validates quantity is present and positive' do
      cart_item = build(:cart_item, quantity: 1)
      expect(cart_item).to be_valid

      cart_item_zero = build(:cart_item, quantity: 0)
      expect(cart_item_zero).not_to be_valid
    end
  end

  describe 'associations' do
    it { should belong_to(:user) }
    it { should belong_to(:product) }
  end

  describe 'factory' do
    it 'creates a valid cart item' do
      cart_item = build(:cart_item)
      expect(cart_item).to be_valid
    end
  end
end
