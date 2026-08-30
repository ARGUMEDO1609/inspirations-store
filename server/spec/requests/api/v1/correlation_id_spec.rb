# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Correlation ID", type: :request do
  let(:user) { create(:user) }

  before do
    allow_any_instance_of(Api::V1::ApiController).to receive(:current_user).and_return(user)
  end

  it "generates a correlation ID when none provided" do
    get "/api/v1/cart_items", as: :json

    expect(response.headers["X-Request-Id"]).to be_present
    expect(response.headers["X-Request-Id"].length).to eq(36)
  end

  it "uses the client-provided correlation ID" do
    get "/api/v1/cart_items", headers: { "X-Request-Id" => "my-custom-id" }, as: :json

    expect(response.headers["X-Request-Id"]).to eq("my-custom-id")
  end

  it "returns correlation ID in error responses" do
    post "/api/v1/login", params: { user: { email: "wrong@test.com", password: "wrong" } }, as: :json

    expect(response.headers["X-Request-Id"]).to be_present
  end
end
