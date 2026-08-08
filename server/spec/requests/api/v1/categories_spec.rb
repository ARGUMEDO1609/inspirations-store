require 'rails_helper'

RSpec.describe 'API V1 Categories', type: :request do
  let(:user) { create(:user) }
  let(:admin) { create(:admin_user) }
  let(:category) { create(:category) }

  describe 'GET /api/v1/categories' do
    it 'returns all categories' do
      category
      get '/api/v1/categories'
      expect(response).to have_http_status(:success)

      parsed = JSON.parse(response.body)
      expect(parsed.dig('data', 0, 'attributes', 'name')).to eq(category.name)
    end
  end

  describe 'GET /api/v1/categories/:id' do
    it 'returns the category' do
      get "/api/v1/categories/#{category.id}"
      expect(response).to have_http_status(:success)

      parsed = JSON.parse(response.body)
      expect(parsed.dig('data', 'attributes', 'name')).to eq(category.name)
    end
  end

  describe 'POST /api/v1/categories' do
    context 'as admin' do
      before do
        allow_any_instance_of(Api::V1::ApiController).to receive(:current_user).and_return(admin)
      end

      it 'creates a category' do
        post '/api/v1/categories', params: { category: { name: 'New Category' } }
        expect(response).to have_http_status(:created)
      end
    end

    context 'as regular user' do
      before do
        allow_any_instance_of(Api::V1::ApiController).to receive(:current_user).and_return(user)
      end

      it 'returns forbidden' do
        post '/api/v1/categories', params: { category: { name: 'New Category' } }
        expect(response).to have_http_status(:forbidden)
      end
    end
  end
end