require 'rails_helper'
require 'securerandom'

RSpec.describe Api::V1::WebhooksController, type: :controller do
  let(:user) { create(:user) }
  let(:product) { create(:product, stock: 8) }
  let(:order) { create(:order, user: user, status: :pending, payment_status: 'pending') }

  before do
    order.order_items.create!(product: product, quantity: 2, unit_price: product.price)
    product.decrement!(:stock, 2)
    allow(Wompi::WebhookValidator).to receive(:valid?).and_return(true)
  end

  describe 'POST #wompi' do
    it 'marks the order as paid when Wompi approves the payment' do
      post :wompi, params: webhook_payload(status: 'APPROVED'), as: :json

      expect(response).to have_http_status(:ok)
      expect(order.reload.status).to eq('paid')
      expect(order.payment_status).to eq('approved')
      expect(product.reload.stock).to eq(6)
      expect(order.payments.last.provider).to eq('wompi')
    end

    it 'restores reserved stock when Wompi declines the payment' do
      post :wompi, params: webhook_payload(status: 'DECLINED'), as: :json

      expect(response).to have_http_status(:ok)
      expect(order.reload.status).to eq('cancelled')
      expect(order.payment_status).to eq('rejected')
      expect(product.reload.stock).to eq(8)
      expect(order.payments.last.status).to eq('DECLINED')
    end
  end

  def webhook_payload(status:)
    {
      data: {
        transaction: {
          id: "tx-#{SecureRandom.hex(4)}",
          reference: order.reference,
          status: status,
          amount_in_cents: (order.total * 100).to_i,
          currency: 'COP'
        }
      }
    }
  end
end
