require 'rails_helper'
require 'jwt'
require 'securerandom'

RSpec.describe Api::V1::PaymentsController, type: :controller do
  let(:user) { create(:user) }
  let(:product) { create(:product) }
  let(:order) { create(:order, user: user, status: :pending, payment_status: 'pending') }
  let(:jwt_secret) { ENV['DEVISE_JWT_SECRET_KEY'] || 'temporary_secret_for_development_1234567890' }
  let(:token_payload) { { sub: user.id, jti: SecureRandom.uuid } }
  let(:token) { JWT.encode(token_payload, jwt_secret, 'HS256') }
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
    request.headers['Authorization'] = "Bearer #{token}"
    order.order_items.create!(product: product, quantity: 1, unit_price: product.price)
    allow(Wompi::CheckoutBuilder).to receive(:build).and_return(checkout_response)
  end

  describe 'GET #create_preference' do
    it 'returns a checkout payload for a pending order' do
      get :create_preference, params: { id: order.id }

      expect(response).to have_http_status(:ok)
      parsed = JSON.parse(response.body)
      expect(parsed.dig('data', 'checkout', 'reference')).to eq(order.reference)
      expect(parsed.dig('data', 'checkout', 'amount_in_cents')).to eq(120_000)
    end

    it 'calls the checkout builder with the current order' do
      get :create_preference, params: { id: order.id }

      expect(Wompi::CheckoutBuilder).to have_received(:build).with(
        hash_including(order: order, frontend_url: anything)
      )
    end

    it 'rejects orders without items' do
      empty_order = create(:order, user: user, status: :pending, payment_status: 'pending')

      get :create_preference, params: { id: empty_order.id }

      expect(response).to have_http_status(:unprocessable_content)
    end

    it 'rejects orders that are not pending' do
      order.update!(status: :paid, payment_status: 'approved')

      get :create_preference, params: { id: order.id }

      expect(response).to have_http_status(:unprocessable_content)
    end
  end
end
