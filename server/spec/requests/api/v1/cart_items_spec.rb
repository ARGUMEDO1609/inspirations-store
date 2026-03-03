require 'rails_helper'

RSpec.describe Api::V1::CartItemsController, type: :controller do
  let(:user) { create(:user) }
  let(:product) { create(:product) }

  before { sign_in user }

  describe 'GET #index' do
    it 'returns cart items for current user' do
      create(:cart_item, user: user, product: product)
      get :index
      expect(response).to have_http_status(:success)
    end
  end

  describe 'POST #create' do
    it 'creates a cart item' do
      post :create, params: { product_id: product.id, quantity: 1 }
      expect(response).to have_http_status(:created)
    end
  end

  describe 'PUT #update' do
    let(:cart_item) { create(:cart_item, user: user, product: product) }

    it 'updates cart item quantity' do
      put :update, params: { id: cart_item.id, quantity: 5 }
      expect(response).to have_http_status(:success)
    end
  end

  describe 'DELETE #destroy' do
    let(:cart_item) { create(:cart_item, user: user, product: product) }

    it 'deletes cart item' do
      delete :destroy, params: { id: cart_item.id }
      expect(response).to have_http_status(:no_content)
    end
  end
end
