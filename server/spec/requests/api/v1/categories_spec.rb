require 'rails_helper'
require 'jwt'
require 'securerandom'

RSpec.describe Api::V1::CategoriesController, type: :controller do
  let(:user) { create(:user) }
  let(:admin) { create(:admin_user) }
  let(:category) { create(:category) }
  let(:jwt_secret) { ENV['DEVISE_JWT_SECRET_KEY'] || 'temporary_secret_for_development_1234567890' }

  def jwt_for(user_record)
    payload = { sub: user_record.id, jti: SecureRandom.uuid }
    JWT.encode(payload, jwt_secret, 'HS256')
  end

  describe 'GET #index' do
    it 'returns all categories' do
      category
      get :index
      expect(response).to have_http_status(:success)
    end
  end

  describe 'GET #show' do
    it 'returns the category' do
      get :show, params: { id: category.id }
      expect(response).to have_http_status(:success)
    end
  end

  describe 'POST #create' do
    context 'as admin' do
      before do
        request.headers['Authorization'] = "Bearer #{jwt_for(admin)}"
      end

      it 'creates a category' do
        post :create, params: { category: { name: 'New Category' } }
        expect(response).to have_http_status(:created)
      end
    end

    context 'as regular user' do
      before do
        request.headers['Authorization'] = "Bearer #{jwt_for(user)}"
      end

      it 'returns forbidden' do
        post :create, params: { category: { name: 'New Category' } }
        expect(response).to have_http_status(:forbidden)
      end
    end
  end
end
