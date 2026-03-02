class OrderPolicy < ApplicationPolicy
  def index?
    user.present?
  end

  def show?
    user.present? && (record.user_id == user.id || user.admin?)
  end

  def create?
    user.present?
  end

  def update?
    user&.admin?
  end
end
