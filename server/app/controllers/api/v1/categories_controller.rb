class Api::V1::CategoriesController < Api::V1::ApiController
  before_action :authenticate_user!, only: [ :create, :update ]

  def index
    @categories = Category.all
    render_success(data: CategorySerializer.new(@categories).serializable_hash)
  end

  def show
    @category = Category.find(params[:id])
    render_success(data: CategorySerializer.new(@category).serializable_hash)
  end

  def create
    authorize Category
    @category = Category.new(category_params)
    if @category.save
      render_success(data: CategorySerializer.new(@category).serializable_hash, message: "Category created successfully", status: :created)
    else
      render_validation_errors(@category.errors.full_messages)
    end
  end

  def update
    @category = Category.find(params[:id])
    authorize @category
    if @category.update(category_params)
      render_success(data: CategorySerializer.new(@category).serializable_hash, message: "Category updated successfully")
    else
      render_validation_errors(@category.errors.full_messages)
    end
  end

  private

  def category_params
    params.require(:category).permit(:name, :description, :image)
  end
end
