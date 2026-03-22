class Api::V1::CategoriesController < Api::V1::ApiController
  before_action :authenticate_user!, only: [ :create, :update ]

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

  def update
    @category = Category.find(params[:id])
    authorize @category
    if @category.update(category_params)
      render json: CategorySerializer.new(@category).serializable_hash
    else
      render json: { errors: @category.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def category_params
    params.require(:category).permit(:name, :slug, :description, :image)
  end
end

