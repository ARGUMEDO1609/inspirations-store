ActiveAdmin.register User do
  permit_params :email, :name, :role, :address, :phone, :password, :password_confirmation

  index do
    selectable_column
    id_column
    column :email
    column :name
    column :role
    column :phone
    column :created_at
    actions
  end

  filter :email
  filter :name
  filter :role, as: :select, collection: User.roles.keys

  form do |f|
    f.inputs do
      f.input :email
      f.input :name
      f.input :role, as: :select, collection: User.roles.keys
      f.input :phone
      f.input :address
      if f.object.new_record?
        f.input :password
        f.input :password_confirmation
      end
    end
    f.actions
  end
end
