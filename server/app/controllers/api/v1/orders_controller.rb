class Api::V1::OrdersController < Api::V1::ApiController
  def index
    @orders = current_user.orders.order(created_at: :desc)
    render json: @orders.as_json(include: :order_items)
  end

  def show
    @order = current_user.orders.find(params[:id])
    render json: @order.as_json(include: { order_items: { include: :product } })
  end

  def create
    @order = current_user.orders.new(order_params)
    @order.status = :pending

    # Calculate total from cart
    cart_items = current_user.cart_items.includes(:product)
    if cart_items.empty?
      render json: { error: "Cart is empty" }, status: :unprocessable_entity
      return
    end

    # Check stock availability
    cart_items.each do |item|
      if item.product.stock < item.quantity
        render json: { error: "Insufficient stock for #{item.product.title}" }, status: :unprocessable_entity
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
        # Deduct stock
        item.product.decrement!(:stock, item.quantity)
      end
      cart_items.destroy_all
      render json: @order, status: :created
    else
      render json: { errors: @order.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    authorize Order
    @order = Order.find(params[:id])
    if @order.update(order_params)
      render json: @order
    else
      render json: { errors: @order.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def order_params
    params.require(:order).permit(:shipping_address)
  end
end
