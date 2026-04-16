class CreateNotes < ActiveRecord::Migration[8.1]
  def change
    unless table_exists?(:notes)
      create_table :notes do |t|
        t.references :notable, polymorphic: true, null: false
        t.references :admin_user, null: false, foreign_key: true
        t.text :body, null: false

        t.timestamps
      end
    end
  end
end
