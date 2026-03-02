class Api::V1::ProductsController < Api::V1::ApiController
  skip_before_action :authenticate_user!, only: [:index, :show]
  
  def index
    @products = if params[:category_id]
                  Category.find(params[:category_id]).products
                else
                  Product.all
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
