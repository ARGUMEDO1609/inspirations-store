# frozen_string_literal: true

require "rails_helper"

RSpec.describe "E2E Checkout Flow", type: :request do
  let(:user) { create(:user) }
  let(:product) { create(:product, stock: 10) }

  before do
    allow_any_instance_of(Api::V1::ApiController).to receive(:current_user).and_return(user)
    allow(Wompi::WebhookValidator).to receive(:valid?).and_return(true)
  end

  describe "Full checkout flow: add to cart → checkout → webhook → order status" do
    it "processes a complete purchase from cart to approved payment" do
      # 1. Add item to cart
      post "/api/v1/cart_items", params: { product_id: product.id, quantity: 2 }, as: :json
      expect(response).to have_http_status(:created)
      expect(user.cart_items.count).to eq(1)

      # 2. Verify cart
      get "/api/v1/cart_items", as: :json
      expect(response).to have_http_status(:ok)
      cart_data = JSON.parse(response.body)
      expect(cart_data["data"]["items"].length).to eq(1)
      expect(cart_data["data"]["items"].first["quantity"]).to eq(2)

      # 3. Create checkout
      post "/api/v1/checkout", params: { checkout: { shipping_address: "Calle 123, Bogota", payment_method: "card" } }, as: :json
      expect(response).to have_http_status(:created)
      checkout_data = JSON.parse(response.body)
      expect(checkout_data.dig("data", "checkout_url")).to include("checkout.wompi.co")
      expect(user.cart_items.count).to eq(0)

      # 4. Get order from database
      order = Order.last
      order_ref = order.reference
      expect(order_ref).to be_present
      expect(order.status).to eq("pending")
      expect(order.total).to be > 0
      expect(order.order_items.count).to eq(1)
      expect(order.order_items.first.quantity).to eq(2)

      # 5. Verify stock was reserved
      expect(product.reload.stock).to eq(8)

      # 6. Simulate Wompi webhook: approved
      tx_id = "tx-e2e-#{SecureRandom.hex(4)}"
      post "/api/v1/webhooks/wompi", params: {
        data: {
          transaction: {
            id: tx_id,
            reference: order_ref,
            status: "APPROVED",
            amount_in_cents: (order.total * 100).to_i,
            currency: "COP"
          }
        }
      }, as: :json
      expect(response).to have_http_status(:ok)

      # 7. Verify order is now paid
      order.reload
      expect(order.status).to eq("paid")
      expect(order.payment_status).to eq("approved")
      expect(order.payments.count).to eq(1)
      expect(order.payments.last.transaction_id).to eq(tx_id)

      # 8. Verify stock was NOT restored (paid, not cancelled)
      expect(product.reload.stock).to eq(8)

      # 9. Verify order via reference lookup
      get "/api/v1/orders/reference/#{order_ref}", as: :json
      expect(response).to have_http_status(:ok)
      ref_data = JSON.parse(response.body)
      expect(ref_data.dig("data", "attributes", "status")).to eq("paid")

      # 10. Verify duplicate webhook is idempotent
      post "/api/v1/webhooks/wompi", params: {
        data: {
          transaction: {
            id: tx_id,
            reference: order_ref,
            status: "APPROVED",
            amount_in_cents: (order.total * 100).to_i,
            currency: "COP"
          }
        }
      }, as: :json
      expect(response).to have_http_status(:ok)
      expect(order.reload.payments.count).to eq(1)
    end

    it "handles declined payment and restores stock" do
      # Add to cart and checkout
      post "/api/v1/cart_items", params: { product_id: product.id, quantity: 3 }, as: :json
      post "/api/v1/checkout", params: { checkout: { shipping_address: "Calle 456", payment_method: "card" } }, as: :json
      order = Order.last
      expect(product.reload.stock).to eq(7)

      # Simulate declined webhook
      post "/api/v1/webhooks/wompi", params: {
        data: {
          transaction: {
            id: "tx-declined-#{SecureRandom.hex(4)}",
            reference: order.reference,
            status: "DECLINED",
            amount_in_cents: (order.total * 100).to_i,
            currency: "COP"
          }
        }
      }, as: :json
      expect(response).to have_http_status(:ok)

      # Verify order cancelled and stock restored
      order.reload
      expect(order.status).to eq("cancelled")
      expect(order.payment_status).to eq("rejected")
      expect(product.reload.stock).to eq(10)
    end

    it "rejects empty cart checkout" do
      post "/api/v1/checkout", params: { checkout: { shipping_address: "Calle 789" } }, as: :json
      expect(response).to have_http_status(:unprocessable_content)
      expect(JSON.parse(response.body)["error"]).to eq("Cart is empty")
    end
  end
end
