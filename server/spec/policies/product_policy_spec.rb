require 'rails_helper'

RSpec.describe ProductPolicy do
  let(:customer) { create(:user) }
  let(:admin) { create(:user, role: :admin) }
  let(:product) { create(:product) }

  describe '#show? and #index?' do
    it 'allows public access to index and show' do
      expect(described_class.new(nil, product).show?).to eq(true)
      expect(described_class.new(customer, product).show?).to eq(true)
      expect(described_class.new(nil, product).index?).to eq(true)
      expect(described_class.new(customer, product).index?).to eq(true)
    end
  end

  describe '#create?, #update? and #destroy?' do
    it 'allows admins' do
      policy = described_class.new(admin, product)
      expect(policy.create?).to eq(true)
      expect(policy.update?).to eq(true)
      expect(policy.destroy?).to eq(true)
    end

    it 'denies non-admin users' do
      policy = described_class.new(customer, product)
      expect(policy.create?).to eq(false)
      expect(policy.update?).to eq(false)
      expect(policy.destroy?).to eq(false)
    end
  end
end
