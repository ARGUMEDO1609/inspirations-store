require 'rails_helper'

RSpec.describe Api::V1::HealthController, type: :controller do
  describe 'GET #show' do
    it 'returns ok with database status' do
      get :show, as: :json

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json["status"]).to eq("ok")
      expect(json["database"]).to eq("ok")
      expect(json["rails"]).to be_present
      expect(json["ruby"]).to be_present
      expect(json["timestamp"]).to be_present
    end

    it 'returns error when database is unreachable' do
      allow(ActiveRecord::Base.connection).to receive(:execute).and_raise(ActiveRecord::ConnectionNotEstablished)

      get :show, as: :json

      expect(response).to have_http_status(:service_unavailable)
      json = JSON.parse(response.body)
      expect(json["database"]).to eq("error")
    end
  end
end
