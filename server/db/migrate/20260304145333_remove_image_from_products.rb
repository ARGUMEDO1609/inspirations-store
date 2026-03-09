class RemoveImageFromProducts < ActiveRecord::Migration[8.1]
  def change
    remove_column :products, :image, :string
  end
end
