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
  let(:session_response) { { session_id: 'sess_123', amount: 120000, currency: 'COP' } }

  before do
    request.headers['Authorization'] = "Bearer #{token}"
    order.order_items.create!(product: product, quantity: 1, unit_price: product.price)
    allow(Epayco::SessionCreator).to receive(:create_session!).and_return(session_response)
  end

  describe 'GET #create_preference' do
    it 'returns a session payload for a pending order' do
      get :create_preference, params: { id: order.id }

      expect(response).to have_http_status(:ok)
      parsed = JSON.parse(response.body)
      expect(parsed.dig('data', 'session_id')).to eq('sess_123')
      expect(parsed.dig('data', 'amount')).to eq(120000)
    end

    it 'calls the session creator with the current order' do
      get :create_preference, params: { id: order.id }

      expect(Epayco::SessionCreator).to have_received(:create_session!).with(
        hash_including(order: order, frontend_url: anything, backend_url: anything)
      )
    end

    it 'rejects orders without items' do
      empty_order = create(:order, user: user, status: :pending, payment_status: 'pending')

      get :create_preference, params: { id: empty_order.id }

      expect(response).to have_http_status(:unprocessable_entity)
    end

    it 'rejects orders that are not pending' do
      order.update!(status: :paid, payment_status: 'approved')

      get :create_preference, params: { id: order.id }

      expect(response).to have_http_status(:unprocessable_entity)
    end
  end
end
