require 'rails_helper'

RSpec.describe 'API V1 Products', type: :request do
  let(:user) { create(:user) }
  let(:admin) { create(:admin_user) }
  let(:category) { create(:category) }
  let(:product) { create(:product, category: category) }

  describe 'GET /api/v1/products' do
    it 'returns all products' do
      product
      get '/api/v1/products'
      expect(response).to have_http_status(:success)

      parsed = JSON.parse(response.body)
      expect(parsed.dig('data', 0, 'attributes', 'title')).to eq(product.title)
    end
  end

  describe 'GET /api/v1/products/:id' do
    it 'returns the product' do
      get "/api/v1/products/#{product.id}"
      expect(response).to have_http_status(:success)

      parsed = JSON.parse(response.body)
      expect(parsed.dig('data', 'attributes', 'title')).to eq(product.title)
    end
  end

  describe 'POST /api/v1/products' do
    context 'as admin' do
      before do
        allow_any_instance_of(Api::V1::ApiController).to receive(:current_user).and_return(admin)
      end

      it 'creates a product' do
        post '/api/v1/products', params: { product: { title: 'New Product', price: 100, stock: 5, category_id: category.id } }
        expect(response).to have_http_status(:created)
      end
    end

    context 'as regular user' do
      before do
        allow_any_instance_of(Api::V1::ApiController).to receive(:current_user).and_return(user)
      end

      it 'returns forbidden' do
        post '/api/v1/products', params: { product: { title: 'New Product', price: 100, stock: 5, category_id: category.id } }
        expect(response).to have_http_status(:forbidden)
      end
    end
  end
end