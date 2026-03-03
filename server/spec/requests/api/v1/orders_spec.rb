require 'rails_helper'

RSpec.describe Api::V1::OrdersController, type: :controller do
  let(:user) { create(:user) }
  let(:product) { create(:product) }

  before { sign_in user }

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

      it 'clears the cart' do
        post :create, params: { order: { shipping_address: '123 Test St' } }
        expect(user.cart_items.count).to eq(0)
      end

      it 'deducts stock' do
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
      let!(:cart_item) { create(:cart_item, user: user, product: product, quantity: 100) }

      it 'returns error' do
        post :create, params: { order: { shipping_address: '123 Test St' } }
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end
end
