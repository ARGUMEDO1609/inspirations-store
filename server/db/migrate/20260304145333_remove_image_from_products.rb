class RemoveImageFromProducts < ActiveRecord::Migration[8.1]
  def change
    remove_column :products, :image, :string if column_exists?(:products, :image)
  end
end
