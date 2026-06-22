class RemoveSlugs < ActiveRecord::Migration[8.1]
  def change
    remove_column :products, :slug, :string
    remove_column :categories, :slug, :string
  end
end
