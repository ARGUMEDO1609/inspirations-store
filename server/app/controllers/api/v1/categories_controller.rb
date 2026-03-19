class Api::V1::CategoriesController < ActionController::API
  include Pundit::Authorization

  rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized

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

  def authenticate_user!
    token = extract_token_from_header

    if token.present?
      user = User.find_for_jwt_authentication_from_token(token)
      if user.present?
        @current_user = user
        return
      end
    end

    render json: { error: "Unauthorized" }, status: :unauthorized
  end

  def extract_token_from_header
    header = request.headers["Authorization"]
    return nil unless header.present?

    header.split(" ").last if header.start_with?("Bearer ")
  end

  def user_not_authorized
    render json: { error: "You are not authorized to perform this action." }, status: :forbidden
  end

  def category_params
    params.require(:category).permit(:name, :slug, :description, :image)
  end
end
