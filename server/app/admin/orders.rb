ActiveAdmin.register Order do
  menu false
  permit_params :status, :shipping_address, :payment_status, :payment_id

  scope :all, default: true
  scope :pending
  scope :paid
  scope :shipped
  scope :completed
  scope :cancelled

  member_action :mark_as_shipped, method: :put do
    resource.update!(status: :shipped)
    redirect_to resource_path(resource), notice: 'Pedido marcado como enviado.'
  end

  member_action :mark_as_completed, method: :put do
    resource.update!(status: :completed)
    redirect_to resource_path(resource), notice: 'Pedido marcado como completado.'
  end

  action_item :mark_as_shipped, only: :show, if: proc { resource.paid? } do
    link_to 'Marcar como enviado', mark_as_shipped_admin_order_path(resource), method: :put
  end

  action_item :mark_as_completed, only: :show, if: proc { resource.shipped? } do
    link_to 'Marcar como completado', mark_as_completed_admin_order_path(resource), method: :put
  end

  index do
    selectable_column
    id_column
    column :user
    column :status do |order|
      status_tag order.status
    end
    column :payment_status
    column :total
    column :shipping_address do |order|
      truncate(order.shipping_address, length: 40)
    end
    column :created_at
    actions defaults: true do |order|
      if order.paid?
        item 'Enviar', mark_as_shipped_admin_order_path(order), method: :put, class: 'member_link'
      elsif order.shipped?
        item 'Completar', mark_as_completed_admin_order_path(order), method: :put, class: 'member_link'
      end
    end
  end

  filter :user
  filter :status, as: :select, collection: Order.statuses.keys
  filter :payment_status
  filter :created_at

  form do |f|
    f.inputs do
      f.input :user, input_html: { disabled: true }
      f.input :status, as: :select, collection: Order.statuses.keys
      f.input :payment_status
      f.input :payment_id
      f.input :shipping_address
    end
    f.actions
  end

  show do
    attributes_table do
      row :id
      row :user
      row :status do |order|
        status_tag order.status
      end
      row :payment_status
      row :payment_id
      row :total
      row :shipping_address
      row :created_at
      row :updated_at
    end

    panel 'Items del pedido' do
      table_for order.order_items.includes(:product) do
        column :product
        column :quantity
        column :unit_price
        column('Subtotal') { |item| number_to_currency(item.unit_price * item.quantity) }
      end
    end
  end
end
