class Api::V1::ProductsController < Api::V1::ApiController
  before_action :authenticate_user!, only: [ :create, :update, :destroy ]

  def index
    @products = Product.all

    if params[:category].present? && params[:category] != "all"
      if params[:category] == "digital"
        @products = @products.joins(:category).where("categories.name ILIKE ?", "%Digital%")
      elsif params[:category] == "physical"
        @products = @products.joins(:category).where.not("categories.name ILIKE ?", "%Digital%")
      else
        @products = @products.joins(:category).where("categories.name = ?", params[:category])
      end
    end

    if params[:sort] == "popular"
      @products = @products.left_joins(:order_items)
                           .group(:id)
                           .select("products.*, COUNT(order_items.id) as sales_count")
                           .order("sales_count DESC")
    else
      @products = @products.order(created_at: :desc)
    end

    render json: ProductSerializer.new(@products).serializable_hash
  end

  def show
    @product = Product.find(params[:id])
    render json: ProductSerializer.new(@product).serializable_hash
  end

  def create
    authorize Product
    @product = Product.new(product_params)
    if @product.save
      render json: ProductSerializer.new(@product).serializable_hash, status: :created
    else
      render json: { errors: @product.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    @product = Product.find(params[:id])
    authorize @product
    if @product.update(product_params)
      render json: ProductSerializer.new(@product).serializable_hash
    else
      render json: { errors: @product.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @product = Product.find(params[:id])
    authorize @product
    @product.destroy
    head :no_content
  end

  private

  def product_params
    params.require(:product).permit(:title, :description, :price, :stock, :image, :category_id)
  end
end

