require 'rails_helper'

RSpec.describe OrderPolicy do
  let(:customer) { create(:user) }
  let(:other_customer) { create(:user) }
  let(:admin) { create(:user, role: :admin) }
  let(:order) { create(:order, user: customer) }

  describe '#show?' do
    it 'allows the owner' do
      expect(described_class.new(customer, order).show?).to eq(true)
    end

    it 'allows admins' do
      expect(described_class.new(admin, order).show?).to eq(true)
    end

    it 'denies other users' do
      expect(described_class.new(other_customer, order).show?).to eq(false)
    end
  end

  describe '#update?' do
    it 'allows admins' do
      expect(described_class.new(admin, order).update?).to eq(true)
    end

    it 'denies customers' do
      expect(described_class.new(customer, order).update?).to eq(false)
    end
  end
end
