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

  describe '#apply_payment_update!' do
    let(:order) { create(:order, status: :pending, payment_status: 'pending') }
    let(:product) { create(:product, stock: 8) }

    before do
      order.order_items.create!(product: product, quantity: 2, unit_price: product.price)
      product.decrement!(:stock, 2)
    end

    it 'marks the order as paid for approved payments' do
      order.apply_payment_update!(payment_id: 'mp_123', payment_status: 'approved')

      expect(order.reload.status).to eq('paid')
      expect(order.payment_status).to eq('approved')
      expect(order.payment_id).to eq('mp_123')
      expect(product.reload.stock).to eq(6)
    end

    it 'restores reserved stock when payment is cancelled from pending' do
      order.apply_payment_update!(payment_id: 'mp_456', payment_status: 'cancelled')

      expect(order.reload.status).to eq('cancelled')
      expect(order.payment_status).to eq('cancelled')
      expect(product.reload.stock).to eq(8)
    end
  end
end
