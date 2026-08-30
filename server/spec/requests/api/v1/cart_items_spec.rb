# frozen_string_literal: true

require "rails_helper"

RSpec.describe "API V1 Cart Items", type: :request do
  let(:user) { create(:user) }
  let(:product) { create(:product, stock: 5) }

  before do
    allow_any_instance_of(Api::V1::ApiController).to receive(:current_user).and_return(user)
  end

  describe "GET /api/v1/cart_items" do
    it "returns cart items for current user" do
      create(:cart_item, user: user, product: product)
      get "/api/v1/cart_items", as: :json

      expect(response).to have_http_status(:success)
      parsed = JSON.parse(response.body)
      expect(parsed["data"]["items"].length).to eq(1)
    end

    it "returns empty array when cart is empty" do
      get "/api/v1/cart_items", as: :json

      expect(response).to have_http_status(:success)
      parsed = JSON.parse(response.body)
      expect(parsed["data"]["items"]).to eq([])
      expect(parsed["data"]["total"]).to eq(0)
    end

    it "calculates total correctly with multiple items" do
      product2 = create(:product, price: 50_000)
      create(:cart_item, user: user, product: product, quantity: 2)
      create(:cart_item, user: user, product: product2, quantity: 1)

      get "/api/v1/cart_items", as: :json

      parsed = JSON.parse(response.body)
      expect(parsed["data"]["items"].length).to eq(2)
      expect(parsed["data"]["total"].to_f).to eq(product.price * 2 + 50_000)
    end

    it "does not return other users cart items" do
      other_user = create(:user)
      create(:cart_item, user: other_user, product: product)

      get "/api/v1/cart_items", as: :json

      parsed = JSON.parse(response.body)
      expect(parsed["data"]["items"]).to eq([])
    end
  end

  describe "POST /api/v1/cart_items" do
    it "creates a cart item" do
      post "/api/v1/cart_items", params: { product_id: product.id, quantity: 1 }, as: :json

      expect(response).to have_http_status(:created)
      expect(user.cart_items.count).to eq(1)
    end

    it "creates a cart item with a selected variant" do
      variant = create(:variant, variantable: product, stock: 3)

      post "/api/v1/cart_items", params: { product_id: product.id, variant_id: variant.id, quantity: 1 }, as: :json

      expect(response).to have_http_status(:created)
      expect(JSON.parse(response.body).dig("data", "variant", "id")).to eq(variant.id)
    end

    it "requires a variant for products that have variants" do
      create(:variant, variantable: product)

      post "/api/v1/cart_items", params: { product_id: product.id, quantity: 1 }, as: :json

      expect(response).to have_http_status(:unprocessable_entity)
      expect(JSON.parse(response.body)["error"]).to include("seleccionarse")
    end

    it "rejects variants from another product" do
      other_product = create(:product)
      variant = create(:variant, variantable: other_product)

      post "/api/v1/cart_items", params: { product_id: product.id, variant_id: variant.id, quantity: 1 }, as: :json

      expect(response).to have_http_status(:unprocessable_entity)
      expect(JSON.parse(response.body)["error"]).to include("no pertenece")
    end

    it "increments quantity when adding same product again" do
      post "/api/v1/cart_items", params: { product_id: product.id, quantity: 2 }, as: :json
      post "/api/v1/cart_items", params: { product_id: product.id, quantity: 1 }, as: :json

      expect(response).to have_http_status(:created)
      cart_item = user.cart_items.find_by(product: product)
      expect(cart_item.quantity).to eq(3)
    end

    it "rejects quantity zero" do
      post "/api/v1/cart_items", params: { product_id: product.id, quantity: 0 }, as: :json

      expect(response).to have_http_status(:unprocessable_entity)
    end

    it "rejects negative quantity" do
      post "/api/v1/cart_items", params: { product_id: product.id, quantity: -1 }, as: :json

      expect(response).to have_http_status(:unprocessable_entity)
    end

    it "rejects adding out-of-stock product" do
      product.update!(stock: 0)

      post "/api/v1/cart_items", params: { product_id: product.id, quantity: 1 }, as: :json

      expect(response).to have_http_status(:unprocessable_entity)
      expect(JSON.parse(response.body)["error"]).to include("stock")
    end

    it "rejects quantity exceeding stock" do
      post "/api/v1/cart_items", params: { product_id: product.id, quantity: 10 }, as: :json

      expect(response).to have_http_status(:unprocessable_entity)
      expect(JSON.parse(response.body)["error"]).to include("stock")
    end

    it "rejects adding variant with zero stock" do
      variant = create(:variant, variantable: product, stock: 0)

      post "/api/v1/cart_items", params: { product_id: product.id, variant_id: variant.id, quantity: 1 }, as: :json

      expect(response).to have_http_status(:unprocessable_entity)
      expect(JSON.parse(response.body)["error"]).to include("stock")
    end

    it "rejects quantity exceeding variant stock" do
      variant = create(:variant, variantable: product, stock: 2)

      post "/api/v1/cart_items", params: { product_id: product.id, variant_id: variant.id, quantity: 5 }, as: :json

      expect(response).to have_http_status(:unprocessable_entity)
      expect(JSON.parse(response.body)["error"]).to include("stock")
    end
  end

  describe "PUT /api/v1/cart_items/:id" do
    let(:cart_item) { create(:cart_item, user: user, product: product, quantity: 1) }

    it "updates cart item quantity" do
      put "/api/v1/cart_items/#{cart_item.id}", params: { quantity: 3 }, as: :json

      expect(response).to have_http_status(:success)
      expect(cart_item.reload.quantity).to eq(3)
    end

    it "rejects quantity exceeding stock" do
      put "/api/v1/cart_items/#{cart_item.id}", params: { quantity: 100 }, as: :json

      expect(response).to have_http_status(:unprocessable_content)
    end

    it "rejects updating another users cart item" do
      other_user = create(:user)
      other_item = create(:cart_item, user: other_user, product: product)

      put "/api/v1/cart_items/#{other_item.id}", params: { quantity: 5 }, as: :json

      expect(response).to have_http_status(:not_found)
    end
  end

  describe "DELETE /api/v1/cart_items/:id" do
    let(:cart_item) { create(:cart_item, user: user, product: product) }

    it "deletes cart item" do
      delete "/api/v1/cart_items/#{cart_item.id}", as: :json

      expect(response).to have_http_status(:no_content)
      expect(user.cart_items.exists?(cart_item.id)).to be false
    end
  end

  describe "DELETE /api/v1/cart_items/clear" do
    it "clears all cart items" do
      create(:cart_item, user: user, product: product, quantity: 2)
      create(:cart_item, user: user, product: create(:product), quantity: 1)

      delete "/api/v1/cart_items/clear", as: :json

      expect(response).to have_http_status(:no_content)
      expect(user.cart_items.count).to eq(0)
    end
  end
end
