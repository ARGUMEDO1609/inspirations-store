require 'rails_helper'

RSpec.describe Variant, type: :model do
  describe 'validations' do
    it { should validate_presence_of(:name) }
    it { should validate_presence_of(:variant_type) }
    it { should validate_numericality_of(:stock).is_greater_than_or_equal_to(0) }
  end

  describe 'associations' do
    it { should belong_to(:variantable) }
  end

  describe 'variant_type enum' do
    it 'allows size as variant_type' do
      product = create(:product)
      variant = create(:variant, variantable: product, variant_type: 'size', name: 'M')
      expect(variant).to be_valid
    end

    it 'allows color as variant_type' do
      product = create(:product)
      variant = create(:variant, variantable: product, variant_type: 'color', name: 'Rojo')
      expect(variant).to be_valid
    end

    it 'allows material as variant_type' do
      product = create(:product)
      variant = create(:variant, variantable: product, variant_type: 'material', name: 'Algodón')
      expect(variant).to be_valid
    end
  end

  describe 'factory' do
    it 'creates a valid variant' do
      product = create(:product)
      variant = build(:variant, variantable: product)
      expect(variant).to be_valid
    end
  end
end
