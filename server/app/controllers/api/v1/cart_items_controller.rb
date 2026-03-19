class Api::V1::CartItemsController < Api::V1::ApiController
  before_action :authenticate_user!

  def index
    @cart_items = current_user.cart_items.includes(:product)
    render json: {
      items: @cart_items.as_json(include: :product),
      total: @cart_items.sum { |item| item.product.price * item.quantity }
    }
  end

  def create
    @cart_item = current_user.cart_items.find_or_initialize_by(product_id: params[:product_id])
    @cart_item.quantity += params[:quantity].to_i if @cart_item.persisted?
    @cart_item.quantity = params[:quantity].to_i unless @cart_item.persisted?

    if @cart_item.save
      render json: @cart_item, status: :created
    else
      render json: { error: @cart_item.errors.full_messages.first }, status: :unprocessable_entity
    end
  end

  def update
    @cart_item = current_user.cart_items.find(params[:id])
    if @cart_item.update(quantity: params[:quantity])
      render json: @cart_item
    else
      render json: { errors: @cart_item.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @cart_item = current_user.cart_items.find(params[:id])
    @cart_item.destroy
    head :no_content
  end

  def clear
    current_user.cart_items.destroy_all
    head :no_content
  end
end
