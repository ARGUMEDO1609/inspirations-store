class AddPaymentMethodToOrders < ActiveRecord::Migration[8.1]
  def change
    add_column :orders, :payment_method, :integer
  end
end
