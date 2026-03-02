class CreateProducts < ActiveRecord::Migration[8.0]
  def change
    create_table :products do |t|
      t.string :title, null: false
      t.text :description
      t.decimal :price, precision: 10, scale: 2, null: false
      t.integer :stock, default: 0
      t.string :image
      t.references :category, null: false, foreign_key: true
      t.string :slug, null: false

      t.timestamps
    end
    add_index :products, :slug, unique: true
  end
end
