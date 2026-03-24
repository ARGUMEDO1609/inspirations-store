class Api::V1::CartItemsController < Api::V1::ApiController
  before_action :authenticate_user!

  def index
    @cart_items = current_user.cart_items.includes(:product)
    render_success(data: {
      items: @cart_items.as_json(include: :product),
      total: @cart_items.sum { |item| item.product.price * item.quantity }
    })
  end

  def create
    @cart_item = current_user.cart_items.find_or_initialize_by(product_id: params[:product_id])
    @cart_item.quantity += params[:quantity].to_i if @cart_item.persisted?
    @cart_item.quantity = params[:quantity].to_i unless @cart_item.persisted?

    if @cart_item.save
      render_success(data: @cart_item, message: "Item added to cart", status: :created)
    else
      render_error(@cart_item.errors.full_messages.first)
    end
  end

  def update
    @cart_item = current_user.cart_items.find(params[:id])
    if @cart_item.update(quantity: params[:quantity])
      render_success(data: @cart_item, message: "Cart updated successfully")
    else
      render_validation_errors(@cart_item.errors.full_messages)
    end
  end

  def destroy
    @cart_item = current_user.cart_items.find(params[:id])
    @cart_item.destroy
    render_success(message: "Item removed from cart", status: :no_content)
  end

  def clear
    current_user.cart_items.destroy_all
    render_success(message: "Cart cleared", status: :no_content)
  end
end
