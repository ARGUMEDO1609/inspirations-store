class AddAddressToUsers < ActiveRecord::Migration[8.1]
  def change
    unless column_exists?(:users, :address)
      add_column :users, :address, :text
    end
  end
end
