require 'rails_helper'

RSpec.describe Product, type: :model do
  let(:category) { create(:category) }

  describe 'validations' do
    it { should validate_presence_of(:title) }
    it { should validate_presence_of(:price) }
    it { should validate_numericality_of(:price).is_greater_than_or_equal_to(0) }
    it { should validate_numericality_of(:stock).only_integer.is_greater_than_or_equal_to(0) }
  end

  describe 'associations' do
    it { should belong_to(:category) }
    it { should have_many(:order_items) }
    it { should have_many(:cart_items) }
  end

  describe 'factory' do
    it 'creates a valid product' do
      product = build(:product, category: category)
      expect(product).to be_valid
    end
  end
end
