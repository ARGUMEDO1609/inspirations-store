module Orders
  class CreateFromCart
    InvalidPaymentMethod = Class.new(StandardError)
    EmptyCart = Class.new(StandardError)
    InsufficientStock = Class.new(StandardError) do
      attr_reader :product

      def initialize(product)
        @product = product
        super("Insufficient stock for #{product.title}")
      end
    end

    SUPPORTED_METHODS = %i[card cash_on_delivery].freeze

    def initialize(user:, shipping_address:, payment_method:)
      @user = user
      @shipping_address = shipping_address.to_s.strip
      @payment_method = payment_method.to_s.strip.downcase.to_sym
    end

    def call
      ActiveRecord::Base.transaction do
        validate_payment_method!

        cart_items = fetch_cart_items
        raise EmptyCart, "Cart is empty" if cart_items.empty?

        total = calculate_total(cart_items)

        order = build_order(total)
        order.save!

        cart_items.each do |cart_item|
          order.order_items.create!(
            product: cart_item.product,
            quantity: cart_item.quantity,
            unit_price: cart_item.product.price
          )
          cart_item.product.decrement!(:stock, cart_item.quantity)
        end

        cart_items.destroy_all

        order
      end
    end

    private

    attr_reader :user, :shipping_address, :payment_method

    def validate_payment_method!
      return if SUPPORTED_METHODS.include?(payment_method)

      raise InvalidPaymentMethod, "Unsupported payment method #{payment_method}"
    end

    def fetch_cart_items
      user.cart_items.includes(:product)
    end

    def calculate_total(cart_items)
      cart_items.sum { |item| item.product.price * item.quantity }
    end

    def build_order(total)
      user.orders.new(
        shipping_address: shipping_address,
        payment_method: payment_method,
        status: payment_method == :cash_on_delivery ? :paid : :pending,
        payment_status: payment_method == :cash_on_delivery ? "cash_on_delivery" : "pending",
        total: total
      )
    end
  end
end
