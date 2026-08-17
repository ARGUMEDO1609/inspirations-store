require 'rails_helper'

RSpec.describe 'API V1 Payments', type: :request do
  let(:user) { create(:user) }
  let(:product) { create(:product) }
  let(:order) { create(:order, user: user, status: :pending, payment_status: 'pending') }
  let(:checkout_response) do
    {
      reference: order.reference,
      order_id: order.id,
      amount_in_cents: 120_000,
      currency: 'COP',
      public_key: 'pub_test_123',
      signature: 'signature_123',
      redirect_url: 'http://localhost:5173/payment/result'
    }
  end

  before do
    allow_any_instance_of(Api::V1::ApiController).to receive(:current_user).and_return(user)
    order.order_items.create!(product: product, quantity: 1, unit_price: product.price)
    allow(Wompi::CheckoutBuilder).to receive(:build).and_return(checkout_response)
  end

  describe 'GET /api/v1/orders/:id/pay' do
    it 'returns a checkout payload for a pending order' do
      get "/api/v1/orders/#{order.id}/pay"

      expect(response).to have_http_status(:ok)
      parsed = JSON.parse(response.body)
      expect(parsed.dig('data', 'checkout', 'reference')).to eq(order.reference)
      expect(parsed.dig('data', 'checkout', 'amount_in_cents')).to eq(120_000)
    end

    it 'calls the checkout builder with the current order' do
      get "/api/v1/orders/#{order.id}/pay"

      expect(Wompi::CheckoutBuilder).to have_received(:build).with(
        hash_including(order: order, frontend_url: anything)
      )
    end

    it 'rejects orders without items' do
      empty_order = create(:order, user: user, status: :pending, payment_status: 'pending')

      get "/api/v1/orders/#{empty_order.id}/pay"

      expect(response).to have_http_status(:unprocessable_content)
    end

    it 'rejects orders that are not pending' do
      order.update!(status: :paid, payment_status: 'approved')

      get "/api/v1/orders/#{order.id}/pay"

      expect(response).to have_http_status(:unprocessable_content)
    end
  end
end
