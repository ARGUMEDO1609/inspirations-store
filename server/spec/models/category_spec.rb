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

  describe 'uniqueness' do
    it 'enforces unique name' do
      create(:category, name: "Test")
      expect { create(:category, name: "Test") }.to raise_error(ActiveRecord::RecordInvalid)
    end
  end
end
