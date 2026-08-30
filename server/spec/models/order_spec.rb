# frozen_string_literal: true

require "rails_helper"

RSpec.describe Order, type: :model do
  describe "validations" do
    it { should validate_presence_of(:total) }
    it { should validate_presence_of(:shipping_address) }
  end

  describe "associations" do
    it { should belong_to(:user) }
    it { should have_many(:order_items).dependent(:destroy) }
  end

  describe "enum" do
    it { should define_enum_for(:status).with_values(pending: 0, paid: 1, shipped: 2, completed: 3, cancelled: 4) }
  end

  describe "factory" do
    it "creates a valid order" do
      order = build(:order)
      expect(order).to be_valid
    end
  end

  describe "#apply_payment_update!" do
    let(:order) { create(:order, status: :pending, payment_status: "pending") }
    let(:product) { create(:product, stock: 8) }

    before do
      order.order_items.create!(product: product, quantity: 2, unit_price: product.price)
      product.decrement!(:stock, 2)
    end

    it "marks the order as paid for approved payments" do
      order.apply_payment_update!(payment_id: "mp_123", payment_status: "approved")

      expect(order.reload.status).to eq("paid")
      expect(order.payment_status).to eq("approved")
      expect(order.payment_id).to eq("mp_123")
      expect(product.reload.stock).to eq(6)
    end

    it "restores reserved stock when payment is cancelled from pending" do
      order.apply_payment_update!(payment_id: "mp_456", payment_status: "cancelled")

      expect(order.reload.status).to eq("cancelled")
      expect(order.payment_status).to eq("cancelled")
      expect(product.reload.stock).to eq(8)
    end

    it "does not restore stock when paid order is declined" do
      order.update!(status: :paid)
      order.apply_payment_update!(payment_id: "mp_789", payment_status: "declined")

      expect(order.reload.status).to eq("cancelled")
      expect(product.reload.stock).to eq(6)
    end

    it "does not downgrade paid to pending on pending payment update" do
      order.update!(status: :paid, payment_status: "approved")
      order.apply_payment_update!(payment_id: "mp_100", payment_status: "pending")

      expect(order.reload.status).to eq("pending")
      expect(order.payment_status).to eq("pending")
    end

    it "handles multiple payment updates atomically" do
      order.apply_payment_update!(payment_id: "tx_a", payment_status: "approved")
      order.apply_payment_update!(payment_id: "tx_b", payment_status: "approved")

      expect(order.reload.status).to eq("paid")
      expect(order.payment_status).to eq("approved")
    end
  end

  describe "#map_order_status" do
    let(:order) { build(:order, status: :pending) }

    it "maps approved payment_status to paid" do
      expect(order.send(:map_order_status, "approved")).to eq(:paid)
    end

    it "keeps pending for in_process states" do
      expect(order.send(:map_order_status, "in_process")).to eq(:pending)
      expect(order.send(:map_order_status, "in_mediation")).to eq(:pending)
    end

    it "maps rejection or cancellation to cancelled" do
      expect(order.send(:map_order_status, "rejected")).to eq(:cancelled)
      expect(order.send(:map_order_status, "cancelled")).to eq(:cancelled)
    end

    it "returns the current status for unknown labels" do
      expect(order.send(:map_order_status, "unexpected")).to eq(:pending)
    end

    it "handles localized status labels from ePayco" do
      expect(order.send(:map_order_status, "Aceptada")).to eq(:paid)
      expect(order.send(:map_order_status, "Pendiente")).to eq(:pending)
      expect(order.send(:map_order_status, "Rechazada")).to eq(:cancelled)
      expect(order.send(:map_order_status, "Fallida")).to eq(:cancelled)
    end
  end

  describe "#should_restore_stock?" do
    let(:order) { build(:order, status: :pending) }

    it "requires the previous status to be pending and the next to be cancelled" do
      expect(order.send(:should_restore_stock?, "pending", :cancelled)).to be(true)
    end

    it "rejects restoring stock for non-pending orders" do
      expect(order.send(:should_restore_stock?, "paid", :cancelled)).to be(false)
      expect(order.send(:should_restore_stock?, "pending", :paid)).to be(false)
    end
  end

  describe "state transitions" do
    let(:order) { create(:order, status: :pending, payment_status: "pending") }
    let(:product) { create(:product, stock: 10) }

    before do
      order.order_items.create!(product: product, quantity: 3, unit_price: product.price)
      product.decrement!(:stock, 3)
    end

    it "pending → paid → shipped → completed" do
      order.apply_payment_update!(payment_id: "tx_1", payment_status: "approved")
      expect(order.reload.status).to eq("paid")

      order.update!(status: :shipped)
      expect(order.reload.status).to eq("shipped")

      order.update!(status: :completed)
      expect(order.reload.status).to eq("completed")
    end

    it "pending → cancelled restores stock" do
      expect(product.reload.stock).to eq(7)

      order.apply_payment_update!(payment_id: "tx_2", payment_status: "cancelled")
      expect(order.reload.status).to eq("cancelled")
      expect(product.reload.stock).to eq(10)
    end

    it "paid → cancelled does not restore stock" do
      order.apply_payment_update!(payment_id: "tx_3", payment_status: "approved")
      expect(product.reload.stock).to eq(7)

      order.update!(status: :cancelled)
      expect(order.reload.status).to eq("cancelled")
      expect(product.reload.stock).to eq(7)
    end

    it "broadcasts status changes via ActionCable" do
      expect {
        order.apply_payment_update!(payment_id: "tx_4", payment_status: "approved")
      }.to have_broadcasted_to("order_channel_#{order.user_id}")
        .with(hash_including(type: "ORDER_STATUS_UPDATE", status: "paid"))
    end
  end

  describe "reference generation" do
    it "generates a unique reference on create" do
      order = create(:order)
      expect(order.reference).to start_with("order-")
      expect(order.reference.length).to be > 10
    end

    it "validates reference uniqueness" do
      order1 = create(:order)
      order2 = build(:order, reference: order1.reference)
      expect(order2).not_to be_valid
      expect(order2.errors[:reference]).to include("has already been taken")
    end
  end
end
