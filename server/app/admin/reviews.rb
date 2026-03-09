ActiveAdmin.register Review do
  menu false # Mantenerlo oculto del menú principal como los demás
  
  permit_params :rating, :comment, :user_id, :reviewable_type, :reviewable_id

  index do
    selectable_column
    id_column
    column :user
    column :reviewable_type
    column :reviewable
    column :rating
    column :created_at
    actions
  end

  filter :user
  filter :reviewable_type
  filter :rating

  form do |f|
    f.inputs do
      f.input :user
      f.input :reviewable_type, as: :select, collection: ["Product", "Category"]
      f.input :reviewable_id, label: "Reviewable ID (O busca por tipo arriba)"
      f.input :rating, as: :select, collection: 1..5
      f.input :comment
    end
    f.actions
  end
end
