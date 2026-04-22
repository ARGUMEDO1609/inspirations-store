class Api::V1::OrdersController < Api::V1::ApiController
  before_action :authenticate_user!

  def index
    @orders = current_user.orders.order(created_at: :desc)
    render_success(data: @orders.as_json(include: { order_items: { include: :variant } }))
  end

  def show
    @order = current_user.orders.find(params[:id])
    render_success(data: @order.as_json(include: { order_items: { include: :variant } }))
  end

  def show_by_reference
    @order = current_user.orders.find_by!(reference: params[:reference])
    render_success(data: @order.as_json(include: { order_items: { include: :variant } }))
  end

  def create
    @order = Orders::CreateFromCart.new(
      user: current_user,
      shipping_address: order_params[:shipping_address],
      payment_method: order_params[:payment_method],
      source_client_id: request.headers["X-Client-Instance-Id"]
    ).call

    if @order.cash_on_delivery?
      render_success(
        data: @order,
        message: "Order placed successfully. Payment will be collected on delivery.",
        status: :created
      )
    else
      render_success(data: @order, message: "Order created successfully", status: :created)
    end
  rescue Orders::CreateFromCart::EmptyCart
    render_error("Cart is empty")
  rescue Orders::CreateFromCart::InsufficientStock => e
    render_error("Insufficient stock for #{e.product&.title}")
  rescue Orders::CreateFromCart::InvalidPaymentMethod => e
    render_error(e.message)
  rescue ActiveRecord::RecordInvalid => e
    render_validation_errors(e.record.errors.full_messages)
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
