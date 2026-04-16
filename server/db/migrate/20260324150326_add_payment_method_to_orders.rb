class AddPaymentMethodToOrders < ActiveRecord::Migration[8.1]
  def change
    add_column :orders, :payment_method, :integer unless column_exists?(:orders, :payment_method)
  end
end
