require 'rails_helper'

RSpec.describe Api::V1::WebhooksController, type: :controller do
  let(:user) { create(:user) }
  let(:product) { create(:product, stock: 8) }
  let(:order) { create(:order, user: user, status: :pending, payment_status: 'pending') }
  let(:sdk) { instance_double(Mercadopago::SDK) }
  let(:payment_api) { double('PaymentApi') }

  before do
    order.order_items.create!(product: product, quantity: 2, unit_price: product.price)
    product.decrement!(:stock, 2)
    allow(Mercadopago::SDK).to receive(:new).and_return(sdk)
    allow(sdk).to receive(:payment).and_return(payment_api)
  end

  describe 'POST #mercadopago' do
    it 'marks the order as paid when Mercado Pago approves the payment' do
      allow(payment_api).to receive(:get).and_return({
        response: {
          'id' => 'pay_123',
          'status' => 'approved',
          'external_reference' => order.id.to_s
        }
      })

      post :mercadopago, params: { type: 'payment', data: { id: 'pay_123' } }

      expect(response).to have_http_status(:ok)
      expect(order.reload.status).to eq('paid')
      expect(order.payment_status).to eq('approved')
      expect(product.reload.stock).to eq(6)
    end

    it 'restores reserved stock when Mercado Pago cancels the payment' do
      allow(payment_api).to receive(:get).and_return({
        response: {
          'id' => 'pay_456',
          'status' => 'cancelled',
          'external_reference' => order.id.to_s
        }
      })

      post :mercadopago, params: { type: 'payment', data: { id: 'pay_456' } }

      expect(response).to have_http_status(:ok)
      expect(order.reload.status).to eq('cancelled')
      expect(order.payment_status).to eq('cancelled')
      expect(product.reload.stock).to eq(8)
    end
  end
end
