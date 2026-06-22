class RepairSchemaColumns < ActiveRecord::Migration[8.1]
  def change
    # Reparar Categories
    unless column_exists?(:categories, :slug)
      add_column :categories, :slug, :string
      add_index :categories, :slug, unique: true unless index_exists?(:categories, :slug)
    end

    # Reparar Products
    unless column_exists?(:products, :slug)
      add_column :products, :slug, :string
      add_index :products, :slug, unique: true unless index_exists?(:products, :slug)
    end

    unless column_exists?(:products, :title)
      # Si existe 'name' pero no 'title', podríamos renombrarlo o añadir title
      add_column :products, :title, :string
    end

    # Reparar Users
    unless column_exists?(:users, :name)
      add_column :users, :name, :string
    end
  end
end
