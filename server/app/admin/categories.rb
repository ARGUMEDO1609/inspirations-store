ActiveAdmin.register Category do
  permit_params :name, :slug

  index do
    selectable_column
    id_column
    column :name
    column :slug
    column :created_at
    actions
  end

  filter :name
  filter :slug
end
