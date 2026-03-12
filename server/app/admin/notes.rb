ActiveAdmin.register Note do
  menu false
  permit_params :notable_type, :notable_id, :body, :admin_user_id

  index do
    selectable_column
    id_column
    column :notable do |note|
      "#{note.notable_type} ##{note.notable_id}"
    end
    column :admin_user
    column :body do |n|
      truncate(n.body, length: 50)
    end
    column :created_at
    actions
  end

  filter :notable_type, as: :select, collection: ["User", "Product", "Order"]
  filter :admin_user
  filter :created_at
end
