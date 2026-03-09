ActiveAdmin.register Address do
  menu false
  permit_params :addressable_type, :addressable_id, :address_line_1, :address_line_2, :city, :state, :zip_code, :country, :address_type

  index do
    selectable_column
    id_column
    column :addressable
    column :address_type
    column :city
    column :country
    actions
  end
end
