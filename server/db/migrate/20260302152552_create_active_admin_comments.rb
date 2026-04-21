class CreateActiveAdminComments < ActiveRecord::Migration[8.1]
  def self.up
    unless table_exists?(:active_admin_comments)
      create_table :active_admin_comments do |t|
        t.string :namespace
        t.text   :body
        t.references :resource, polymorphic: true
        t.references :author, polymorphic: true
        t.timestamps
      end
      add_index :active_admin_comments, [ :namespace ]
    end
  end

  def self.down
    drop_table :active_admin_comments, if_exists: true
  end
end
