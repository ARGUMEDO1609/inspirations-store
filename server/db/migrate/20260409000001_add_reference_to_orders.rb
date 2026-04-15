require "securerandom"

class AddReferenceToOrders < ActiveRecord::Migration[8.1]
  disable_ddl_transaction!

  def up
    add_column :orders, :reference, :string
    add_index :orders, :reference, unique: true, algorithm: :concurrently

    say_with_time "Backfilling order references" do
      Order.reset_column_information
      Order.find_each do |order|
        next if order.reference.present?
        order.update_column(:reference, generate_reference)
      end
    end

    change_column_null :orders, :reference, false
  end

  def down
    remove_index :orders, :reference
    remove_column :orders, :reference
  end

  private

  def generate_reference
    loop do
      token = "order-#{SecureRandom.hex(6)}"
      return token unless Order.exists?(reference: token)
    end
  end
end
