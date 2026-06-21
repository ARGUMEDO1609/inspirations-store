class FinalSchemaSanitization < ActiveRecord::Migration[8.1]
  def change
    # Reparar Orders
    unless column_exists?(:orders, :payment_status)
      add_column :orders, :payment_status, :string
    end
    unless column_exists?(:orders, :shipping_address)
      add_column :orders, :shipping_address, :text
    end

    # Reparar Products
    unless column_exists?(:products, :image)
      add_column :products, :image, :string
    end
  end
end
