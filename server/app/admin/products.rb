ActiveAdmin.register Product do
  permit_params :title, :description, :price, :stock, :category_id, :image, :slug

  index do
    selectable_column
    id_column
    column :title
    column :category
    column :price
    column :stock
    column :created_at
    actions
  end

  filter :title
  filter :category
  filter :price
  filter :stock

  form do |f|
    f.inputs do
      f.input :category
      f.input :title
      f.input :description
      f.input :price
      f.input :stock
      f.input :image
      f.input :slug
    end
    f.actions
  end
end
