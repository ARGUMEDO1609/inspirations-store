ActiveAdmin.register Note do
  menu false
  permit_params :notable_type, :notable_id, :body, :admin_user_id

  index do
    selectable_column
    id_column
    column :notable
    column :admin_user
    column :body do |n|
      truncate(n.body, length: 50)
    end
    column :created_at
    actions
  end
end
