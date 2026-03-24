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
    @order = current_user.orders.new(order_params)
    @order.status = :pending
    @order.payment_status = "pending"

    cart_items = current_user.cart_items.includes(:product)
    if cart_items.empty?
      render_error("Cart is empty")
      return
    end

    cart_items.each do |item|
      if item.product.stock < item.quantity
        render_error("Insufficient stock for #{item.product.title}")
        return
      end
    end

    @order.total = cart_items.sum { |item| item.product.price * item.quantity }

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
      render_success(data: @order, message: "Order created successfully", status: :created)
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
    params.require(:order).permit(:shipping_address)
  end
end
