require 'rails_helper'
require 'jwt'
require 'securerandom'

RSpec.describe Api::V1::OrdersController, type: :controller do
  let(:user) { create(:user) }
  let(:product) { create(:product) }
  let(:jwt_secret) { ENV['DEVISE_JWT_SECRET_KEY'] || 'temporary_secret_for_development_1234567890' }
  let(:token_payload) { { sub: user.id, jti: SecureRandom.uuid } }
  let(:token) { JWT.encode(token_payload, jwt_secret, 'HS256') }

  before do
    request.headers['Authorization'] = "Bearer #{token}"
  end

  describe 'GET #index' do
    it 'returns orders for current user' do
      create(:order, user: user)
      get :index
      expect(response).to have_http_status(:success)
    end
  end

  describe 'GET #show' do
    let(:order) { create(:order, user: user) }

    it 'returns the order' do
      get :show, params: { id: order.id }
      expect(response).to have_http_status(:success)
    end
  end

  describe 'POST #create' do
    context 'with items in cart' do
      let!(:cart_item) { create(:cart_item, user: user, product: product, quantity: 2) }

      it 'creates an order' do
        post :create, params: { order: { shipping_address: '123 Test St' } }
        expect(response).to have_http_status(:created)
        expect(Order.count).to eq(1)
      end

      it 'marks payment as pending' do
        post :create, params: { order: { shipping_address: '123 Test St' } }
        expect(Order.last.payment_status).to eq('pending')
      end

      it 'clears the cart' do
        post :create, params: { order: { shipping_address: '123 Test St' } }
        expect(user.cart_items.count).to eq(0)
      end

      it 'deducts stock to reserve inventory' do
        original_stock = product.stock
        post :create, params: { order: { shipping_address: '123 Test St' } }
        expect(product.reload.stock).to eq(original_stock - 2)
      end
    end

    context 'with empty cart' do
      it 'returns error' do
        post :create, params: { order: { shipping_address: '123 Test St' } }
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end

    context 'with insufficient stock' do
      let!(:cart_item) { create(:cart_item, user: user, product: product, quantity: 2) }

      before do
        product.update!(stock: 1)
      end

      it 'returns error' do
        post :create, params: { order: { shipping_address: '123 Test St' } }
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end
end
