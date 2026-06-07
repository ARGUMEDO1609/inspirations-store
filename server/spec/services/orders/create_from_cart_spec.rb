require "rails_helper"

RSpec.describe Orders::CreateFromCart do
  let(:user) { create(:user) }
  let(:category) { create(:category) }
  let(:product) { create(:product, category: category, stock: 8, price: 150.0) }
  let(:shipping_address) { "Calle 123 #45-67" }

  before do
    allow(CartItem).to receive(:broadcast_cart_update_for)
  end

  describe "#call" do
    context "with a card payment" do
      let!(:cart_item) { create(:cart_item, user: user, product: product, quantity: 2) }

      it "creates a pending order and reserves stock" do
        order = described_class.new(
          user: user,
          shipping_address: shipping_address,
          payment_method: :card
        ).call

        expect(order).to be_persisted
        expect(order.status).to eq("pending")
        expect(order.payment_status).to eq("pending")
        expect(order.payment_method).to eq("card")
        expect(order.total).to eq(300.0)
        expect(order.order_items.count).to eq(1)
        expect(order.order_items.first.quantity).to eq(2)
        expect(product.reload.stock).to eq(6)
        expect(user.cart_items).to be_empty
        expect(CartItem).to have_received(:broadcast_cart_update_for).with(
          user,
          action: "checked_out",
          source_client_id: nil
        )
      end
    end

    context "with cash on delivery" do
      let!(:cart_item) { create(:cart_item, user: user, product: product, quantity: 1) }

      it "creates a paid order immediately" do
        order = described_class.new(
          user: user,
          shipping_address: shipping_address,
          payment_method: :cash_on_delivery
        ).call

        expect(order.status).to eq("paid")
        expect(order.payment_status).to eq("cash_on_delivery")
        expect(order.payment_method).to eq("cash_on_delivery")
        expect(product.reload.stock).to eq(7)
      end
    end

    context "when the cart is empty" do
      it "raises an error" do
        expect do
          described_class.new(
            user: user,
            shipping_address: shipping_address,
            payment_method: :card
          ).call
        end.to raise_error(Orders::CreateFromCart::EmptyCart, "Cart is empty")
      end
    end

    context "with an unsupported payment method" do
      let!(:cart_item) { create(:cart_item, user: user, product: product, quantity: 1) }

      it "raises an error before creating the order" do
        expect do
          described_class.new(
            user: user,
            shipping_address: shipping_address,
            payment_method: :bitcoin
          ).call
        end.to raise_error(Orders::CreateFromCart::InvalidPaymentMethod, "Unsupported payment method bitcoin")
      end
    end
  end
end
