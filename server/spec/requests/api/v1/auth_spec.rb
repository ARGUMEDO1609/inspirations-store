require 'rails_helper'
require 'jwt'
require 'securerandom'

RSpec.describe 'API V1 Auth', type: :request do
  let(:user) { create(:user, password: 'password123', password_confirmation: 'password123') }
  let(:jwt_secret) { ENV['DEVISE_JWT_SECRET_KEY'] || 'temporary_secret_for_development_1234567890' }
  let(:token_payload) { { sub: user.id, jti: SecureRandom.uuid } }
  let(:token) { JWT.encode(token_payload, jwt_secret, 'HS256') }

  describe 'POST /api/v1/login' do
    it 'logs in with valid credentials' do
      post '/api/v1/login', params: { user: { email: user.email, password: 'password123' } }

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body).dig('data', 'email')).to eq(user.email)
    end

    it 'rejects invalid credentials' do
      post '/api/v1/login', params: { user: { email: user.email, password: 'wrong-password' } }

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
      }

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body).dig('data', 'email')).to eq('new-user@example.com')
    end
  end

  describe 'GET /api/v1/current_user' do
    it 'returns the current user for a valid token' do
      get '/api/v1/current_user', headers: { 'Authorization' => "Bearer #{token}" }

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body).dig('data', 'email')).to eq(user.email)
    end

    it 'rejects missing tokens' do
      get '/api/v1/current_user'

      expect(response).to have_http_status(:unauthorized)
    end
  end
end
