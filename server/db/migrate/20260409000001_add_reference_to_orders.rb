require "securerandom"

class AddReferenceToOrders < ActiveRecord::Migration[8.1]
  disable_ddl_transaction!

  def up
    add_column :orders, :reference, :string unless column_exists?(:orders, :reference)
    add_index :orders, :reference, unique: true, algorithm: :concurrently unless index_exists?(:orders, :reference)

    say_with_time "Backfilling order references" do
      # Usar execute para evitar problemas con el modelo si la tabla no está lista
      # O simplemente resetear información si el modelo es accesible
      begin
        Order.reset_column_information
        Order.find_each do |order|
          next if order.reference.present?
          order.update_column(:reference, generate_reference)
        end
      rescue => e
        say "Skipping backfill: #{e.message}"
      end
    end

    # Solo intentar poner null false si la columna existe
    if column_exists?(:orders, :reference)
      change_column_null :orders, :reference, false rescue say "Could not set null false on reference"
    end
  end

  def down
    remove_index :orders, :reference if index_exists?(:orders, :reference)
    remove_column :orders, :reference if column_exists?(:orders, :reference)
  end

  private

  def generate_reference
    loop do
      token = "order-#{SecureRandom.hex(6)}"
      # Usar SQL directo o verificar si el modelo responde
      return token unless ActiveRecord::Base.connection.execute("SELECT 1 FROM orders WHERE reference = '#{token}'").any?
    end
  end
end
