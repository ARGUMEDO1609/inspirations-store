class CategoryPolicy < ApplicationPolicy
  def index?
    true
  end

  def create?
    user&.admin?
  end

  def update?
    user&.admin?
  end
end
