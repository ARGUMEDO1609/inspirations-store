# frozen_string_literal: true

require "rails_helper"

RSpec.describe "CORS", type: :request do
  it "allows credentialed requests from the Vite development server" do
    options "/api/v1/current_user", headers: {
      "Origin" => "http://localhost:5173",
      "Access-Control-Request-Method" => "GET",
      "Access-Control-Request-Headers" => "content-type,x-client-instance-id"
    }

    expect(response).to have_http_status(:ok)
    expect(response.headers["Access-Control-Allow-Origin"]).to eq("http://localhost:5173")
    expect(response.headers["Access-Control-Allow-Credentials"]).to eq("true")
  end
end
