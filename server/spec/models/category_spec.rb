require 'rails_helper'

RSpec.describe Category, type: :model do
  describe 'validations' do
    it { should validate_presence_of(:name) }
  end

  describe 'associations' do
    it { should have_many(:products).dependent(:destroy) }
  end

  describe 'factory' do
    it 'creates a valid category' do
      category = build(:category)
      expect(category).to be_valid
    end
  end

  describe 'slug generation' do
    it 'generates slug from name' do
      category = create(:category, name: "Test Category")
      expect(category.slug).to eq("test-category")
    end

    it 'does not regenerate slug if already present' do
      category = create(:category, name: "Test Category", slug: "custom-slug")
      category.update(name: "New Name")
      expect(category.slug).to eq("custom-slug")
    end
  end

  describe 'uniqueness' do
    it 'enforces unique name' do
      create(:category, name: "Test")
      expect { create(:category, name: "Test") }.to raise_error(ActiveRecord::RecordInvalid)
    end

    it 'enforces unique slug' do
      create(:category, name: "Test", slug: "test")
      expect { create(:category, name: "Other", slug: "test") }.to raise_error(ActiveRecord::RecordInvalid)
    end
  end
end
