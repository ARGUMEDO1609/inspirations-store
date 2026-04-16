class CreateCategories < ActiveRecord::Migration[8.0]
  def change
    unless table_exists?(:categories)
      create_table :categories do |t|
        t.string :name, null: false
        t.string :slug, null: false

        t.timestamps
      end
      add_index :categories, :slug, unique: true
    end
  end
end
