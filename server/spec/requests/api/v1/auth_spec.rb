require 'rails_helper'

RSpec.describe 'API V1 Auth', type: :request do
  let(:user) { create(:user, password: 'password123', password_confirmation: 'password123') }

  describe 'POST /api/v1/login' do
    it 'logs in with valid credentials' do
      post '/api/v1/login', params: { user: { email: user.email, password: 'password123' } }, as: :json

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body).dig('data', 'attributes', 'email')).to eq(user.email)
    end

    it 'rejects invalid credentials' do
      post '/api/v1/login', params: { user: { email: user.email, password: 'wrong-password' } }, as: :json

      expect(response).to have_http_status(:unauthorized)
    end
  end

  describe 'POST /api/v1/signup' do
    it 'creates a user with valid data' do
      post '/api/v1/signup', params: {
        user: {
          email: 'new-user@example.com',
          password: 'password123',
          password_confirmation: 'password123',
          name: 'New User',
          address: '123 Main St',
          phone: '1234567890'
        }
      }, as: :json

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body).dig('data', 'attributes', 'email')).to eq('new-user@example.com')
    end
  end

  describe 'GET /api/v1/current_user' do
    it 'returns an empty session when no user is signed in' do
      get '/api/v1/current_user', as: :json

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)).to eq('success' => true, 'data' => nil)
    end
  end

  describe 'DELETE /api/v1/logout' do
    it 'logs out the current user' do
      # Login first
      post '/api/v1/login', params: { user: { email: user.email, password: 'password123' } }, as: :json
      expect(response).to have_http_status(:ok)

      # Logout
      delete '/api/v1/logout', as: :json

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)).to eq('success' => true, 'message' => 'Logged out successfully')

      # Verify session is cleared
      get '/api/v1/current_user', as: :json
      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)).to eq('success' => true, 'data' => nil)
    end
  end
end