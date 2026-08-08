require 'rails_helper'

RSpec.describe 'API V1 Cart Items', type: :request do
  let(:user) { create(:user) }
  let(:product) { create(:product) }

  before do
    # Stub current_user for authenticated requests in tests
    allow_any_instance_of(Api::V1::ApiController).to receive(:current_user).and_return(user)
  end

  describe 'GET /api/v1/cart_items' do
    it 'returns cart items for current user' do
      create(:cart_item, user: user, product: product)
      get '/api/v1/cart_items', as: :json
      expect(response).to have_http_status(:success)
    end
  end

  describe 'POST /api/v1/cart_items' do
    it 'creates a cart item' do
      post '/api/v1/cart_items', params: { product_id: product.id, quantity: 1 }, as: :json
      expect(response).to have_http_status(:created)
    end
  end

  describe 'PUT /api/v1/cart_items/:id' do
    let(:cart_item) { create(:cart_item, user: user, product: product) }

    it 'updates cart item quantity' do
      put "/api/v1/cart_items/#{cart_item.id}", params: { quantity: 5 }, as: :json
      expect(response).to have_http_status(:success)
    end
  end

  describe 'DELETE /api/v1/cart_items/:id' do
    let(:cart_item) { create(:cart_item, user: user, product: product) }

    it 'deletes cart item' do
      delete "/api/v1/cart_items/#{cart_item.id}", as: :json
      expect(response).to have_http_status(:no_content)
    end
  end
end