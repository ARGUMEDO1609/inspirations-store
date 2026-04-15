class Payment < ApplicationRecord
  belongs_to :order

  validates :provider, :transaction_id, :status, presence: true
  validates :transaction_id, uniqueness: true
end
