class CreateReviews < ActiveRecord::Migration[8.1]
  def change
    unless table_exists?(:reviews)
      create_table :reviews do |t|
        t.references :user, null: false, foreign_key: true
        t.references :reviewable, polymorphic: true, null: false
        t.integer :rating, null: false, default: 5
        t.text :comment

        t.timestamps
      end
    end
  end
end
