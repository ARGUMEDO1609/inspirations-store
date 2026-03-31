class Api::V1::OrdersController < Api::V1::ApiController
  before_action :authenticate_user!

  def index
    @orders = current_user.orders.order(created_at: :desc)
    render_success(data: @orders.as_json(include: :order_items))
  end

  def show
    @order = current_user.orders.find(params[:id])
    render_success(data: @order.as_json(include: { order_items: { include: :product } }))
  end

  def create
    cart_items = current_user.cart_items.includes(:product)
    if cart_items.empty?
      render_error("Cart is empty")
      return
    end

    insufficient_items = cart_items.select { |item| item.product.stock < item.quantity }
    if insufficient_items.any?
      render_error("Insufficient stock for #{insufficient_items.first.product.title}")
      return
    end

    payment_method = order_params[:payment_method]&.to_sym
    unless [ :card, :cash_on_delivery ].include?(payment_method)
      render_error("Invalid payment method")
      return
    end

    total = cart_items.sum { |item| item.product.price * item.quantity }

    @order = current_user.orders.new(
      shipping_address: order_params[:shipping_address],
      status: payment_method == :cash_on_delivery ? :paid : :pending,
      payment_status: payment_method == :cash_on_delivery ? "cash_on_delivery" : "pending",
      payment_method: payment_method,
      total: total
    )

    if @order.save
      cart_items.each do |item|
        @order.order_items.create!(
          product: item.product,
          quantity: item.quantity,
          unit_price: item.product.price
        )
        item.product.decrement!(:stock, item.quantity)
      end
      cart_items.destroy_all

      if payment_method == :cash_on_delivery
        render_success(data: @order, message: "Order placed successfully. Payment will be collected on delivery.", status: :created)
      else
        render_success(data: @order, message: "Order created successfully", status: :created)
      end
    else
      render_validation_errors(@order.errors.full_messages)
    end
  end

  def update
    authorize Order
    @order = Order.find(params[:id])
    if @order.update(order_params)
      render_success(data: @order, message: "Order updated successfully")
    else
      render_validation_errors(@order.errors.full_messages)
    end
  end

  private

  def order_params
    params.require(:order).permit(:shipping_address, :payment_method)
  end
end
