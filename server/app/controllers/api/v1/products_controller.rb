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
      render_success(data: ProductSerializer.new(@product).serializable_hash, message: "Product created successfully", status: :created)
    else
      render_validation_errors(@product.errors.full_messages)
    end
  end

  def update
    @product = Product.find(params[:id])
    authorize @product
    if @product.update(product_params)
      render_success(data: ProductSerializer.new(@product).serializable_hash, message: "Product updated successfully")
    else
      render_validation_errors(@product.errors.full_messages)
    end
  end

  def destroy
    @product = Product.find(params[:id])
    authorize @product
    @product.destroy
    render_success(message: "Product deleted successfully", status: :no_content)
  end

  private

  def product_params
    params.require(:product).permit(:title, :description, :price, :stock, :image, :category_id)
  end
end
