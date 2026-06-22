class CreateCartItems < ActiveRecord::Migration[8.0]
  def change
    unless table_exists?(:cart_items)
      create_table :cart_items do |t|
        t.references :user, null: false, foreign_key: true
        t.references :product, null: false, foreign_key: true
        t.integer :quantity, null: false, default: 1

        t.timestamps
      end
    end
  end
end
