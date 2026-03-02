class Api::V1::CategoriesController < Api::V1::ApiController
  skip_before_action :authenticate_user!, only: [:index, :show]

  def index
    @categories = Category.all
    render json: CategorySerializer.new(@categories).serializable_hash
  end

  def show
    @category = Category.find(params[:id])
    render json: CategorySerializer.new(@category).serializable_hash
  end

  def create
    authorize Category
    @category = Category.new(category_params)
    if @category.save
      render json: CategorySerializer.new(@category).serializable_hash, status: :created
    else
      render json: { errors: @category.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def category_params
    params.require(:category).permit(:name)
  end
end
