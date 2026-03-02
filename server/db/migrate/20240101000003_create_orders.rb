class CreateOrders < ActiveRecord::Migration[8.0]
  def change
    create_table :orders do |t|
      t.references :user, null: false, foreign_key: true
      t.integer :status, default: 0 # 0: pending, 1: paid, 2: shipped, 3: completed, 4: cancelled
      t.decimal :total, precision: 10, scale: 2
      t.text :shipping_address
      t.string :payment_id
      t.string :payment_status

      t.timestamps
    end
  end
end
