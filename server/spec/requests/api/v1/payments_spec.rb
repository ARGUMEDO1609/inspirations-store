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
  let(:sdk) { instance_double(Mercadopago::SDK) }
  let(:preference_api) { double('PreferenceApi') }

  before do
    request.headers['Authorization'] = "Bearer #{token}"
    order.order_items.create!(product: product, quantity: 1, unit_price: product.price)
    allow(Mercadopago::SDK).to receive(:new).and_return(sdk)
    allow(sdk).to receive(:preference).and_return(preference_api)
  end

  describe 'GET #create_preference' do
    it 'creates a payment preference for a pending order' do
      allow(preference_api).to receive(:create).and_return({
        response: {
          'id' => 'pref_123',
          'init_point' => 'https://checkout.test/pref_123'
        }
      })

      get :create_preference, params: { id: order.id }

      expect(response).to have_http_status(:success)
      expect(order.reload.payment_id).to eq('pref_123')
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
