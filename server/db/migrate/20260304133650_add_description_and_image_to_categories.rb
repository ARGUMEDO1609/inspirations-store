class AddDescriptionAndImageToCategories < ActiveRecord::Migration[8.1]
  def change
    add_column :categories, :description, :text unless column_exists?(:categories, :description)
    add_column :categories, :image, :string unless column_exists?(:categories, :image)
  end
end
