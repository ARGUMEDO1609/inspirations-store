require 'rails_helper'
require 'jwt'
require 'securerandom'

RSpec.describe Api::V1::CheckoutsController, type: :controller do
  let(:user) { create(:user) }
  let(:product) { create(:product) }
  let(:cart_item) { create(:cart_item, user: user, product: product, quantity: 1) }
  let(:jwt_secret) { ENV['DEVISE_JWT_SECRET_KEY'] || 'temporary_secret_for_development_1234567890' }
  let(:token_payload) { { sub: user.id, jti: SecureRandom.uuid } }
  let(:token) { JWT.encode(token_payload, jwt_secret, 'HS256') }

  before do
    request.headers['Authorization'] = "Bearer #{token}"
  end

  describe 'POST #create' do
    context 'with cart items' do
      before do
        cart_item
        ENV['WOMPI_PUBLIC_KEY'] = 'pk_test_checkouts'
        ENV['WOMPI_INTEGRITY_KEY'] = 'integrity_test_checkouts'
      end

      after do
        ENV.delete('WOMPI_PUBLIC_KEY')
        ENV.delete('WOMPI_INTEGRITY_KEY')
      end

      it 'builds an order and returns a checkout URL' do
        post :create, params: { checkout: { shipping_address: 'Calle 123' } }, as: :json

        expect(response).to have_http_status(:created)
        parsed = JSON.parse(response.body)
        checkout_url = parsed.dig('data', 'checkout_url')
        query = Rack::Utils.parse_query(URI.parse(checkout_url).query)

        expect(checkout_url).to include('https://checkout.wompi.co/p/')
        expect(query['signature:integrity']).to be_present
        expect(Order.last.reference).to be_present
      end
    end

    context 'with empty cart' do
      it 'returns an error' do
        post :create, params: { checkout: { shipping_address: 'Calle 123' } }, as: :json

        expect(response).to have_http_status(:unprocessable_entity)
        parsed = JSON.parse(response.body)
        expect(parsed['error']).to eq('Cart is empty')
      end
    end

    context 'when Wompi is misconfigured' do
      before do
        cart_item
        ENV.delete('WOMPI_PUBLIC_KEY')
        ENV['WOMPI_INTEGRITY_KEY'] = 'integrity_test_checkouts'
      end

      it 'returns a configuration error' do
        post :create, params: { checkout: { shipping_address: 'Calle 123' } }, as: :json

        expect(response).to have_http_status(:unprocessable_entity)
        parsed = JSON.parse(response.body)
        expect(parsed['error']).to eq('No pudimos preparar el pago')
      end
    end
  end
end
