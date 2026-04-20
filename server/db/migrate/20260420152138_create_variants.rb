class CreateVariants < ActiveRecord::Migration[8.1]
  def change
    create_table :variants do |t|
      t.references :variantable, polymorphic: true, null: false
      t.string :name
      t.string :variant_type
      t.integer :stock, default: 0

      t.timestamps
    end
    add_index :variants, [:variantable_type, :variantable_id, :name], unique: true, name: 'idx_variant_product_name'
  end
end
