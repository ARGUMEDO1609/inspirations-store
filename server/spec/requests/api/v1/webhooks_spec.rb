require 'rails_helper'
require 'securerandom'

RSpec.describe Api::V1::WebhooksController, type: :controller do
  let(:user) { create(:user) }
  let(:product) { create(:product, stock: 8) }
  let(:order) { create(:order, user: user, status: :pending, payment_status: 'pending') }

  before do
    order.order_items.create!(product: product, quantity: 2, unit_price: product.price)
    product.decrement!(:stock, 2)
    allow(Epayco::WebhookValidator).to receive(:valid_signature?).and_return(true)
  end

  describe 'POST #epayco' do
    it 'marks the order as paid when ePayco approves the payment' do
      post :epayco, params: webhook_params(status: 'Aceptada', ref_payco: 'ref-pay-123')

      expect(response).to have_http_status(:ok)
      expect(order.reload.status).to eq('paid')
      expect(order.payment_status).to eq('approved')
      expect(product.reload.stock).to eq(6)
    end

    it 'restores reserved stock when ePayco flags the payment as failed' do
      post :epayco, params: webhook_params(status: 'Rechazada', ref_payco: 'ref-pay-456')

      expect(response).to have_http_status(:ok)
      expect(order.reload.status).to eq('cancelled')
      expect(order.payment_status).to eq('rejected')
      expect(product.reload.stock).to eq(8)
    end
  end

  def webhook_params(status:, ref_payco:)
    {
      x_id_invoice: order.id.to_s,
      x_response: status,
      x_ref_payco: ref_payco,
      x_transaction_id: "tx-#{SecureRandom.hex(4)}",
      x_amount: order.total.to_s,
      x_currency_code: "COP",
      x_signature: "signature"
    }
  end
end
