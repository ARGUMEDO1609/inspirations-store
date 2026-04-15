class CreatePayments < ActiveRecord::Migration[8.1]
  def change
    create_table :payments do |t|
      t.references :order, null: false, foreign_key: true, index: true
      t.string :provider, null: false
      t.string :transaction_id, null: false
      t.string :status, null: false

      t.timestamps
    end

    add_index :payments, :transaction_id, unique: true
  end
end
