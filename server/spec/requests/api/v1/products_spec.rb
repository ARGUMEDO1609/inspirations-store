require 'rails_helper'
require 'jwt'
require 'securerandom'

RSpec.describe Api::V1::ProductsController, type: :controller do
  let(:user) { create(:user) }
  let(:admin) { create(:admin_user) }
  let(:category) { create(:category) }
  let(:product) { create(:product, category: category) }
  let(:jwt_secret) { ENV['DEVISE_JWT_SECRET_KEY'] || 'temporary_secret_for_development_1234567890' }

  describe 'GET #index' do
    it 'returns all products' do
      product
      get :index
      expect(response).to have_http_status(:success)
    end
  end

  describe 'GET #show' do
    it 'returns the product' do
      get :show, params: { id: product.id }
      expect(response).to have_http_status(:success)
    end
  end

  describe 'POST #create' do
    context 'as admin' do
      let(:token) { JWT.encode({ sub: admin.id, jti: SecureRandom.uuid }, jwt_secret, 'HS256') }

      before { request.headers['Authorization'] = "Bearer #{token}" }

      it 'creates a product' do
        post :create, params: { product: { title: 'New Product', price: 100, stock: 5, category_id: category.id } }
        expect(response).to have_http_status(:created)
      end
    end

    context 'as regular user' do
      let(:token) { JWT.encode({ sub: user.id, jti: SecureRandom.uuid }, jwt_secret, 'HS256') }

      before { request.headers['Authorization'] = "Bearer #{token}" }

      it 'returns forbidden' do
        post :create, params: { product: { title: 'New Product', price: 100, stock: 5, category_id: category.id } }
        expect(response).to have_http_status(:forbidden)
      end
    end
  end
end
