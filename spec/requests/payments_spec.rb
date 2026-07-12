# spec/requests/payments_spec.rb

RSpec.describe "Payment API" do
  describe "GET /api/v1/payments" do
    it "returns 200 status" do
      get "/api/v1/payments"
      expect(response).to have_http_status(200)
    end
  end
end
