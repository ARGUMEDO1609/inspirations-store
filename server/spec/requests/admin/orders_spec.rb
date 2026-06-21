require "rails_helper"

RSpec.describe "Admin::Orders", type: :request do
  include Warden::Test::Helpers

  let(:admin_user) { create(:admin_user) }
  let(:user) { create(:user) }
  let(:order) { create(:order, user: user, status: :paid, payment_status: "approved") }

  before do
    Warden.test_mode!
    login_as admin_user, scope: :admin_user
  end

  after do
    Warden.test_reset!
  end

  describe "PUT /admin/orders/:id/mark_as_shipped" do
    it "moves a paid order to shipped" do
      put mark_as_shipped_admin_order_path(order)

      expect(response).to redirect_to(admin_order_path(order))
      expect(order.reload.status).to eq("shipped")
    end
  end

  describe "PUT /admin/orders/:id/mark_as_completed" do
    it "moves a shipped order to completed" do
      order.update!(status: :shipped)

      put mark_as_completed_admin_order_path(order)

      expect(response).to redirect_to(admin_order_path(order))
      expect(order.reload.status).to eq("completed")
    end
  end

  describe "PUT /admin/orders/:id/mark_as_shipped" do
    it "keeps a pending order unchanged" do
      pending_order = create(:order, user: user, status: :pending, payment_status: "pending")

      put mark_as_shipped_admin_order_path(pending_order)

      expect(response).to redirect_to(admin_order_path(pending_order))
      expect(pending_order.reload.status).to eq("pending")
    end
  end
end
