class CategoryPolicy < ApplicationPolicy
  def index?
    true
  end

  def create?
    user&.admin?
  end
end
