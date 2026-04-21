ActiveAdmin.register User do
  menu false
  permit_params :email, :name, :role, :address, :phone, :password, :password_confirmation

  index title: "Clientes" do
    selectable_column

    column("Cliente") do |user|
      div do
        strong link_to(user.name, admin_user_path(user))
      end
      div user.email, style: "color:#6b7280; font-size:12px; margin-top:4px;"
    end

    column("Rol") { |user| status_tag user.role }
    column("Teléfono", &:phone)
    column("Dirección") { |user| truncate(user.display_address, length: 44) }
    column("Pedidos") { |user| user.orders.count }
    column("Alta") { |user| l(user.created_at, format: :short) }
    actions
  end

  filter :email
  filter :name
  filter :role, as: :select, collection: User.roles.keys
  filter :created_at

  form do |f|
    f.inputs "Perfil" do
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

  show title: proc { |user| user.name } do
    columns do
      column do
        panel "Perfil del cliente" do
          attributes_table_for user do
            row :name
            row :email
            row :role
            row :phone
            row("Dirección") { |record| record.display_address }
            row("Alta") { |record| l(record.created_at, format: :long) }
          end
        end
      end

      column do
        panel "Actividad" do
          attributes_table_for user do
            row("Pedidos") { |record| record.orders.count }
            row("Carrito activo") { |record| record.cart_items.count }
            row("Reseñas") { |record| record.reviews.count }
            row("Notas internas") { |record| record.notes.count }
          end
        end
      end
    end
  end
end
