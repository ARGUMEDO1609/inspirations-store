class CreateAddresses < ActiveRecord::Migration[8.1]
  def change
    unless table_exists?(:addresses)
      create_table :addresses do |t|
        t.references :addressable, polymorphic: true, null: false
        t.string :address_line_1, null: false
        t.string :address_line_2
        t.string :city, null: false
        t.string :state
        t.string :zip_code
        t.string :country, default: "Colombia"
        t.integer :address_type, default: 0 # 0: shipping, 1: billing, 2: home

        t.timestamps
      end
    end
  end
end
