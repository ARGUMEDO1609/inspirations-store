class RemoveImageFromCategories < ActiveRecord::Migration[8.1]
  def change
    remove_column :categories, :image, :string
  end
end
