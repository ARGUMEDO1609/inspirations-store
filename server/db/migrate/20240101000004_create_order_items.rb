class CreateOrderItems < ActiveRecord::Migration[8.0]
  def change
    unless table_exists?(:order_items)
      create_table :order_items do |t|
        t.references :order, null: false, foreign_key: true
        t.references :product, null: false, foreign_key: true
        t.integer :quantity, null: false, default: 1
        t.decimal :unit_price, precision: 10, scale: 2, null: false

        t.timestamps
      end
    end
  end
end
